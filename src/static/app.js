document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      // Add extra activities if not provided by API
      const extraActivities = {
        "Basketball Pickup": {
          description: "Casual 5-on-5 games for all skill levels.",
          schedule: "Tue & Thu 6:00 PM",
          max_participants: 10,
          participants: []
        },
        "Soccer Skills": {
          description: "Drills and small-sided games to improve ball control.",
          schedule: "Sat 9:00 AM",
          max_participants: 14,
          participants: []
        },
        "Watercolor Workshop": {
          description: "Learn watercolor techniques and composition.",
          schedule: "Sun 2:00 PM",
          max_participants: 12,
          participants: []
        },
        "Pottery Basics": {
          description: "Hand-building and wheel-throwing for beginners.",
          schedule: "Wed 5:30 PM",
          max_participants: 8,
          participants: []
        },
        "Chess Club": {
          description: "Friendly matches, puzzles, and strategy discussion.",
          schedule: "Mon 7:00 PM",
          max_participants: 16,
          participants: []
        },
        "Creative Writing": {
          description: "Prompts, critique, and short-form writing exercises.",
          schedule: "Fri 6:30 PM",
          max_participants: 12,
          participants: []
        }
      };

      // Merge extras into activities without overwriting existing entries
      Object.entries(extraActivities).forEach(([name, details]) => {
        if (!(name in activities)) {
          activities[name] = details;
        }
      });

      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - (details.participants ? details.participants.length : 0);

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();

        // Refresh activities to show updated participants/availability
        fetchActivities();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
