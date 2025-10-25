import { Navbar, Nav, Container, Button, Offcanvas, Form, Collapse } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/api";

export default function MyNavbar({ fetchTasks }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showMenu, setShowMenu] = useState(false);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", status: "INCOMPLETE" });

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/auth/login");
      return;
    }
    if (!newTask.title.trim()) return;

    try {
      await API.post("/v1/tasks/add", newTask);
      setNewTask({ title: "", status: "INCOMPLETE" });
      fetchTasks();
      setShowAddTaskForm(false); 
      setShowMenu(false);       
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="shadow">
        <Container>
          <Navbar.Brand onClick={() => navigate("/v1/tasks")} style={{ cursor: "pointer" }}>
            TodoApp
          </Navbar.Brand>
          <Button variant="light" className="ms-auto" onClick={() => setShowMenu(true)}>
            ☰ Menu
          </Button>
        </Container>
      </Navbar>

      <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>🧭 Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Nav Links */}
          <Nav className="flex-column mb-3">
            <Nav.Link onClick={() => { navigate("/"); setShowMenu(false); }}>🏠 Home</Nav.Link>
            {/* <Nav.Link onClick={() => { navigate("/v1/tasks"); setShowMenu(false); }}>📋 Task</Nav.Link> */}
          </Nav>

          <hr />

          {/* Nút hiện form thêm task */}
          <Button
            variant="warning"
            className="w-100 mb-2 fw-bold text-white"
            onClick={() => setShowAddTaskForm(!showAddTaskForm)}
          >
            ➕ Add Task
          </Button>

          {/* Form thêm task */}
          <Collapse in={showAddTaskForm}>
            <div>
              <Form onSubmit={handleAddTask} className="mt-2">
                <Form.Group className="mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên task..."
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  >
                    <option value="INCOMPLETE">INCOMPLETE</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </Form.Select>
                </Form.Group>
                <Button type="submit" variant="warning" className="w-100 fw-bold text-white">
                  Add Task
                </Button>
              </Form>
            </div>
          </Collapse>

          {token && (
            <>
              <hr />
              <Button variant="danger" className="w-100" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
