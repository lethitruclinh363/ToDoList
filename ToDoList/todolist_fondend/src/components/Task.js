import { useEffect, useState, useCallback } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaTasks } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";

export default function Task() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", status: "INCOMPLETE" });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "";

  // Fetch task list
  const fetchTasks = useCallback(async () => {
    try {
      const res = await API.get("/v1/tasks");
      let taskData = Array.isArray(res.data)
        ? res.data
        : res.data.data || res.data.tasks || [];
      setTasks(taskData);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Add task
  const handleAddTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
      return;
    }
    if (!newTask.title.trim()) return;

    try {
      await API.post("/v1/tasks/add", newTask);
      setNewTask({ title: "", status: "INCOMPLETE" });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Search task
  const handleFindTask = async (e) => {
    e.preventDefault();
    const keyword = searchTerm.trim();
    if (!keyword) {
      fetchTasks();
      return;
    }

    try {
      const res = await API.get(
        `/v1/tasks/search?keyword=${encodeURIComponent(keyword)}`
      );
      let taskData = Array.isArray(res.data)
        ? res.data
        : res.data.data || res.data.tasks || [];
      setTasks(taskData);
    } catch (err) {
      console.error(err);
      setTasks([]);
    }
  };

  // Toggle status
  const handleToggleStatus = async (task) => {
    try {
      const newStatus =
        task.status === "COMPLETED" ? "INCOMPLETE" : "COMPLETED";
      await API.put(`/v1/tasks/update/${task.id}`, {
        title: task.title,
        status: newStatus,
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Delete
  const handleDelete = async (taskId) => {
    if (!window.confirm("Bạn có chắc muốn xóa task này không?")) return;
    try {
      await API.delete(`/v1/tasks/delete/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Save edit
  const handleSaveEdit = async (updatedTask) => {
    try {
      await API.put(`/v1/tasks/update/${updatedTask.id}`, {
        title: updatedTask.title,
        status: updatedTask.status,
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column py-4"
      style={{
        background:
          "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 25%, #a18cd1 50%, #fbc2eb 75%, #8fd3f4 100%)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 20s ease infinite",
      }}
    >
      {/* Header */}
      <div className="container mb-4">
        <div className="d-flex justify-content-between align-items-center text-white">
          <button
            className="btn btn-light"
            data-bs-toggle="offcanvas"
            data-bs-target="#menuOffcanvas"
          >
            ☰ Menu
          </button>
          <h2 className="fw-bold">
            <FaTasks className="me-2" />
            {username
              ? username.toLowerCase() === "admin"
                ? "Task Dashboard"
                : `${username}'s Task List`
              : "Task List"}
          </h2>
          <button className="btn btn-outline-light" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Offcanvas Menu */}
      <div
        className="offcanvas offcanvas-start text-bg-light"
        tabIndex="-1"
        id="menuOffcanvas"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title text-primary fw-bold">🧭 Menu</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="mb-3">
            <button
              className="btn btn-outline-primary w-100 mb-2"
              onClick={() => navigate("/")}
            >
              🏠 Home
            </button>
          </div>
        </div>
      </div>

      {/* Task List + Add + Search */}
      <div className="container">
        <div className="p-4 bg-white shadow-lg rounded-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <h4 className="text-primary fw-bold mb-3">🗂️ Task List</h4>

            {/* Search + Add Task form */}
            <form
              className="d-flex flex-wrap gap-2 align-items-center"
              style={{ maxWidth: "100%" }}
            >
              {/* Search */}
              <input
                type="text"
                className="form-control"
                style={{ width: "200px" }}
                placeholder="🔍 Search task..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
                <button
                type="button"
                className="btn btn-primary"
                onClick={handleFindTask}
              >
                🔍 Search
              </button>
              {/* Add Task */}
              <input
                type="text"
                className="form-control"
                style={{ width: "200px" }}
                placeholder="➕ Add new task..."
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />

              {/* Status */}
              <select
                className="form-select"
                style={{ width: "150px" }}
                value={newTask.status}
                onChange={(e) =>
                  setNewTask({ ...newTask, status: e.target.value })
                }
              >
                <option value="INCOMPLETE">INCOMPLETE</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>

              {/* Buttons */}
              <button
                type="button"
                className="btn btn-success fw-bold text-white"
                onClick={handleAddTask}
              >
                ➕ Add
              </button>

            
            </form>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      Không có task nào
                    </td>
                  </tr>
                ) : (
                  tasks.map((task, index) => (
                    <tr
                      key={task.id}
                      className="table-row-hover shadow-sm rounded-2"
                    >
                      <td>{index + 1}</td>
                      <td className="fw-semibold">{task.title}</td>
                      <td>
                        <span
                          className={`badge ${
                            task.status === "COMPLETED"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className={`btn btn-sm me-2 ${
                            task.status === "INCOMPLETE"
                              ? "btn-success"
                              : "btn-warning"
                          }`}
                          onClick={() => handleToggleStatus(task)}
                        >
                          {task.status === "INCOMPLETE"
                            ? "✅ Complete"
                            : "🔄 Incomplete"}
                        </button>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => setEditingTask(task)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(task.id)}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Edit */}
      <Modal show={!!editingTask} onHide={() => setEditingTask(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={editingTask?.title || ""}
            onChange={(e) =>
              setEditingTask((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Nhập title mới"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditingTask(null)}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleSaveEdit(editingTask);
              setEditingTask(null);
            }}
          >
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .table-row-hover:hover {
          background-color: #f1f3f5 !important;
          transform: scale(1.01);
          transition: 0.3s ease;
        }

        @keyframes gradientBG {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }
      `}</style>
    </div>
  );
}
