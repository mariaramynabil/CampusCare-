const supabase = require("../config/supabase");

const validStatuses = ["Pending", "In Progress", "Resolved", "Closed"];

const createIssue = async (req, res) => {
  try {
    const { title, description, category, location, image_url } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        error: "Title, description, category and location are required.",
      });
    }

    const { data, error } = await supabase
      .from("issues")
      .insert([
        {
          title,
          description,
          category,
          location,
          image_url: image_url || null,
          user_id: req.user.id,
          status: "Pending",
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      message: "Issue submitted successfully",
      issue: data,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getAllIssues = async (req, res) => {
  try {
    const { status, category } = req.query;

    let query = supabase
      .from("issues")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);
    if (category) query = query.eq("category", category);

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getMyIssues = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getAssignedIssues = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .eq("assigned_worker_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({ error: "Issue not found" });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status." });
    }

    const { data, error } = await supabase
      .from("issues")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Issue status updated",
      issue: data,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const closeIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("issues")
      .update({ status: "Closed", updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Issue closed successfully",
      issue: data,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const assignWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const { assigned_worker_id } = req.body;

    if (!assigned_worker_id) {
      return res.status(400).json({ error: "assigned_worker_id is required." });
    }

    const { data, error } = await supabase
      .from("issues")
      .update({
        assigned_worker_id,
        status: "In Progress",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Worker assigned successfully",
      issue: data,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const addCommentToIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Comment content is required." });
    }

    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          content,
          issue_id: id,
          user_id: req.user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      message: "Comment added successfully",
      comment: data,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const uploadCompletionPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { completion_photo_url } = req.body;

    if (!completion_photo_url) {
      return res.status(400).json({ error: "completion_photo_url is required." });
    }

    const { data, error } = await supabase
      .from("issues")
      .update({
        completion_photo_url,
        status: "Resolved",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Completion photo added successfully",
      issue: data,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;

    await supabase.from("comments").delete().eq("issue_id", id);

    const { error } = await supabase.from("issues").delete().eq("id", id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: "Issue deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createIssue,
  getAllIssues,
  getMyIssues,
  getAssignedIssues,
  getIssueById,
  updateIssueStatus,
  closeIssue,
  assignWorker,
  addCommentToIssue,
  uploadCompletionPhoto,
  deleteIssue,
};
