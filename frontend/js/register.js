document.getElementById("registerForm").addEventListener("submit", async e => {
  e.preventDefault();
  const message = document.getElementById("message");
  try {
    const data = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
      })
    });
    setSession(data);
    message.className = "message success";
    message.textContent = "Account created. Redirecting...";
    setTimeout(() => window.location.href = "index.html", 500);
  } catch (error) {
    message.textContent = error.message;
  }
});
