const supabase = require("../config/supabase");

const createComment = async (req, res) => {
  try {
    const {
      content,
      user_id,
      issue_id,
    } = req.body;

    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          content,
          user_id,
          issue_id,
        },
      ])
      .select();

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(201).json({
      message: "Comment added successfully",
      comment: data,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const getIssueComments = async (req, res) => {
  try {
    const { issue_id } = req.params;

    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("issue_id", issue_id);

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

const deleteCommentsByIssue = async (req, res) => {
  try {
    const { issue_id } = req.params;

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("issue_id", issue_id);

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(200).json({
      message: "Comments deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  createComment,
  getIssueComments,
  deleteCommentsByIssue,
};