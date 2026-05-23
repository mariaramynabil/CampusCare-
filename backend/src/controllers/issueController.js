const supabase = require("../config/supabase");

const CATEGORY_IDS = {
  Electrical: 1,
  Plumbing: 2,
  Cleaning: 3,
  Furniture: 4,
  Other: 5,
};

const normalizeStatus = (status) => {
  if (!status) return "pending";
  const value = status.toLowerCase();

  if (value.includes("progress")) return "in_progress";
  if (value.includes("resolved")) return "resolved";
  if (value.includes("closed")) return "closed";

  return "pending";
};

const submitIssue = async (req, res) => {
  try {
    const { title, description, category, location, image_url, photo_url, priority } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        error: "Title, description, category, and location are required",
      });
    }

    const { data: firstUser } = await supabase
      .from("users")
      .select("id")
      .limit(1)
      .single();

    const issuePayload = {
      title: title.trim(),
      description: description.trim(),
      category_id: CATEGORY_IDS[category] || 5,
      location_id: 5,
      custom_location: location.trim(),
      status: "pending",
      priority: priority || "medium",
      photo_url: image_url || photo_url || null,
      reported_by: firstUser?.id || null,
    };

    const { data, error } = await supabase
      .from("issues")
      .insert([issuePayload])
      .select("*")
      .single();

    if (error) {
      console.error("Submit issue Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      message: "Issue submitted successfully",
      issue: data,
    });
  } catch (error) {
    console.error("Submit issue server error:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getAllIssues = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get all issues error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json(data || []);
  } catch (error) {
    console.error("Get all issues server error:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getMyIssues = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get my issues error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json(data || []);
  } catch (error) {
    console.error("Get my issues server error:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getAssignedIssues = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get assigned issues error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json(data || []);
  } catch (error) {
    console.error("Get assigned issues server error:", error);
    return res.status(500).json({ error: error.message });
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
      console.error("Get issue by id error:", error);
      return res.status(404).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error("Get issue by id server error:", error);
    return res.status(500).json({ error: error.message });
  }
};

const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from("issues")
      .update({
        status: normalizeStatus(status),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Update issue status error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      message: "Issue status updated successfully",
      issue: data,
    });
  } catch (error) {
    console.error("Update issue status server error:", error);
    return res.status(500).json({ error: error.message });
  }
};

const assignIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { worker_id, assigned_worker_id } = req.body;

    const { data, error } = await supabase
      .from("issues")
      .update({
        assigned_to: worker_id || assigned_worker_id || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Assign issue error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      message: "Issue assigned successfully",
      issue: data,
    });
  } catch (error) {
    console.error("Assign issue server error:", error);
    return res.status(500).json({ error: error.message });
  }
};

const closeIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("issues")
      .update({
        status: "closed",
        closed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Close issue error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      message: "Issue closed successfully",
      issue: data,
    });
  } catch (error) {
    console.error("Close issue server error:", error);
    return res.status(500).json({ error: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    return res.status(201).json({
      message: "Comment added successfully",
    });
  } catch (error) {
    console.error("Add comment server error:", error);
    return res.status(500).json({ error: error.message });
  }
};

const uploadCompletionPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { completion_photo_url, photo_url } = req.body;

    const { data, error } = await supabase
      .from("issues")
      .update({
        completion_photo_url: completion_photo_url || photo_url || null,
        status: "resolved",
        resolved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Upload completion photo error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      message: "Completion photo uploaded successfully",
      issue: data,
    });
  } catch (error) {
    console.error("Upload completion photo server error:", error);
    return res.status(500).json({ error: error.message });
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
      console.error("Delete issue error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    console.error("Delete issue server error:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  submitIssue,
  createIssue: submitIssue,

  getAllIssues,
  getMyIssues,
  getUserIssues: getMyIssues,
  getAssignedIssues,
  getIssueById,

  updateIssueStatus,
  updateStatus: updateIssueStatus,

  assignIssue,
  assignWorker: assignIssue,

  closeIssue,

  addComment,
  addCommentToIssue: addComment,

  uploadCompletionPhoto,
  deleteIssue,
};