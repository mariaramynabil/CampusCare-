const supabase = require("../config/supabase");

const getWorkers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, full_name, email, role, is_active")
      .eq("role", "worker")
      .order("full_name", { ascending: true });

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const updateWorkerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const { data, error } = await supabase
      .from("users")
      .update({ is_active })
      .eq("id", id)
      .eq("role", "worker")
      .select("id, full_name, email, role, is_active")
      .single();

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({
      message: "Worker status updated successfully",
      worker: data,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getWorkers, updateWorkerStatus };
