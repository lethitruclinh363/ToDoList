import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaTasks } from "react-icons/fa";

export default function HomePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div
  className="d-flex align-items-center justify-content-center vh-100"
  style={{
    background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 25%, #a18cd1 50%, #fbc2eb 75%, #8fd3f4 100%)",
    backgroundSize: "400% 400%",
    animation: "gradientBG 20s ease infinite",
  }}
>
  <Card
    className="text-center shadow-lg p-4"
    style={{
      maxWidth: "500px",
      borderRadius: "20px",
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      border: "2px solid #ffd700",
    }}
  >
    <Card.Body>
      <FaTasks size={50} className="mb-3 text-warning" />
      <Card.Title style={{ fontSize: "2.2rem", fontWeight: "700" }}>
        Chào mừng đến với Todo App
      </Card.Title>
      <Card.Text className="mb-4 text-secondary" style={{ fontSize: "1rem" }}>
        Quản lý task dễ dàng, nhanh chóng và trực quan. Theo dõi tiến độ của bạn mọi lúc mọi nơi.
      </Card.Text>
<Button
  size="lg"
  variant="warning"
  className="text-white fw-bold shadow-sm"
  onClick={() => {
    if (token) {
      navigate("/v1/tasks"); // Đã login → vào Task
    } else {
      alert("Bạn cần đăng nhập trước khi bắt đầu!");
      navigate("/auth/login");
    }
  }}
>
  {token ? "Bắt đầu" : "Đăng nhập để bắt đầu"}
</Button>

    </Card.Body>
  </Card>

  <style>{`
    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `}</style>
</div>
  );
}
