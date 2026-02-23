import { Request, Response } from 'express'
import crypto from 'crypto'
import razorpay from '../services/razorpayService'
import Order from '../models/Order'
import Listing from '../models/Listing'

// Step 1 — Create Razorpay order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { listingId, quantity } = req.body

    // Find the listing to get the price
    const listing = await Listing.findById(listingId)
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' })
    }

    const totalAmount = listing.price * quantity

    // Create order on Razorpay
    // Amount must be in paise (1 rupee = 100 paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    })

    // Save order in our database with pending status
    const order = await Order.create({
      user: userId,
      listing: listingId,
      quantity,
      totalAmount,
      razorpayOrderId: razorpayOrder.id,
      status: 'pending'
    })

    // Send back what frontend needs to open Razorpay popup
    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: order._id
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not create order' })
  }
}

// Step 3 — Verify payment signature
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId
    } = req.body

    // Generate expected signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
      .update(body)
      .digest('hex')

    // Compare signatures
    const isValid = expectedSignature === razorpay_signature

    if (!isValid) {
      // Signature mismatch — payment is fake
      await Order.findByIdAndUpdate(dbOrderId, { status: 'failed' })
      return res.status(400).json({ message: 'Payment verification failed' })
    }

    // Signature matches — payment is real
    await Order.findByIdAndUpdate(dbOrderId, { status: 'paid' })

    res.json({ message: 'Payment verified successfully', success: true })
  } catch (error) {
    res.status(500).json({ message: 'Verification error' })
  }
}

// Get user orders
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const orders = await Order.find({ user: userId })
      .populate({
        path: 'listing',
        populate: { path: 'product', select: 'name type' }
      })
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}