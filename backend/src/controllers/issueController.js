const supabase = require("../config/supabase");

const createIssue = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      image_url,
      user_id,
    } = req.body;

    const { data, error } = await supabase
      .from("issues")
      .insert([
        {
          title,
          description,
          location,
          image_url,
          user_id,
          status: "Pending",
        },
      ])
      .select();

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(201).json({
      message: "Issue submitted successfully",
      issue: data,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const getAllIssues = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("issues")
      .select("*");

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const getUserIssues = async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    const { data, error } = await supabase
      .from("issues")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(200).json({
      message: "Issue status updated",
      issue: data,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("issues")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(200).json({
      message: "Issue deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const assignWorker = async (req, res) => {
  try {
    const { id } = req.params;

    const { assigned_worker_id } = req.body;

    const { data, error } = await supabase
      .from("issues")
      .update({ assigned_worker_id })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(200).json({
      message: "Worker assigned successfully",
      issue: data,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  createIssue,
  getAllIssues,
  getUserIssues,
  updateIssueStatus,
  deleteIssue,
  assignWorker,
};