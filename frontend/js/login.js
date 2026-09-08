document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const message = document.getElementById("message");
  message.textContent = "Signing in...";
  try {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
      })
    });
    setSession(data);
    message.className = "message success";
    message.textContent = "Login successful. Redirecting...";
    setTimeout(() => {
      window.location.href = data.user.role === "admin" ? "admin.html" : "index.html";
    }, 500);
  } catch (error) {
    message.className = "message";
    message.textContent = error.message;
  }
});
