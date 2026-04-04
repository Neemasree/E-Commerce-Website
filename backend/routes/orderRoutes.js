router.put("/:id/cancel", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: "Cancel failed" });
  }
});
