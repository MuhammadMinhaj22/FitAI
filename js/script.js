// GSAP (GreenSock Animation Platform)
const gsapScript = document.createElement('script');
gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js';
gsapScript.onload = () => {
    // This function runs only after the GSAP script has loaded
    initGsapAnimations();
};
document.head.appendChild(gsapScript);

function initGsapAnimations() {
    // GSAP Animations for the hero section
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.animated-headline span', { y: 100, opacity: 0, stagger: 0.05, duration: 0.8 });
    tl.from('.hero-content p', { y: 50, opacity: 0, duration: 0.8 }, '-=0.5');
    tl.from('.cta-button', { scale: 0.8, opacity: 0, duration: 0.8 }, '-=0.5');

    // Scroll-triggered animations for other sections
    gsap.utils.toArray('.output-card, .about-card, .contact-form, .contact-info').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none none',
            },
            y: 50,
            opacity: 0,
            duration: 1,
        });
    });

    // Mouse-follow parallax effect for hero content
    const heroSection = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');
    if (heroSection && heroContent) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const moveX = (e.clientX - centerX) / 30;
            const moveY = (e.clientY - centerY) / 30;
            gsap.to(heroContent, { x: moveX, y: moveY, duration: 0.5, ease: 'power2.out' });
        });
        heroSection.addEventListener('mouseleave', () => {
            gsap.to(heroContent, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Standard DOM manipulation and event listeners ---

    // Loading Screen
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        window.addEventListener('load', () => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        });
    }

    // Custom Cursor
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => cursor.classList.add('grow'));
        link.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
    });

    // Header and Form variables
    const plannerForm = document.getElementById('planner-form');
    const contactForm = document.getElementById('contact-form');
    const header = document.querySelector('header');
    const thinkingAnimation = document.getElementById('thinking-animation');
    const outputSection = document.getElementById('output-section');
    const messageSentConfirmation = document.getElementById('message-sent-confirmation');

    // Sticky header animation
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Staggered text animation for hero headline
    const heroHeadline = document.querySelector('.animated-headline');
    if (heroHeadline) {
        const spans = heroHeadline.querySelectorAll('span');
        spans.forEach((span, index) => {
            span.style.setProperty('--delay', `${index * 0.05}s`);
        });
    }

    // Planner form submission
    if (plannerForm) {
        plannerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            thinkingAnimation.classList.remove('hidden');
            outputSection.classList.add('hidden');
            setTimeout(() => {
                const age = parseInt(document.getElementById('age').value);
                const weight = parseFloat(document.getElementById('weight').value);
                const height = parseFloat(document.getElementById('height').value);
                const gender = document.getElementById('gender').value;
                const goal = document.getElementById('goal').value;
                const activity = document.getElementById('activity').value;

                if (isNaN(age) || isNaN(weight) || isNaN(height) || age <= 0 || weight <= 0 || height <= 0) {
                    alert("Please enter valid age, weight, and height.");
                    thinkingAnimation.classList.add('hidden');
                    return;
                }

                const bmi = calculateBMI(weight, height);
                const dailyCalories = calculateCalories(weight, height, age, gender, activity, goal);
                const waterIntake = calculateWaterIntake(weight);
                const workoutPlan = generateWorkoutPlan(goal, activity);
                const dietPlan = generateDietPlan(dailyCalories, goal);
                const weeklySchedule = generateWeeklySchedule(workoutPlan, dietPlan);

                thinkingAnimation.classList.add('hidden');
                displayResults(bmi, dailyCalories, waterIntake, workoutPlan, dietPlan, weeklySchedule);
            }, 2000);
        });
    }

    // Contact form submission handling
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            contactForm.reset();
            contactForm.classList.add('hidden');
            if (messageSentConfirmation) {
                messageSentConfirmation.classList.remove('hidden');
                setTimeout(() => {
                    messageSentConfirmation.classList.add('hidden');
                    contactForm.classList.remove('hidden');
                }, 5000);
            }
        });
    }
});

// --- Calculation and Generation Functions ---

function calculateBMI(weight, height) {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
}

function calculateCalories(weight, height, age, gender, activity, goal) {
    let bmr;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    const activityMultipliers = { low: 1.375, moderate: 1.55, high: 1.725 };
    let dailyCalories = bmr * (activityMultipliers[activity] || 1.2);
    if (goal === 'lose') dailyCalories -= 500;
    if (goal === 'gain') dailyCalories += 500;
    return Math.round(dailyCalories);
}

function calculateWaterIntake(weight) {
    return Math.round(weight * 0.033 * 1000);
}

// --- Enhanced AI Simulation Logic ---

const exercises = {
    cardio: ["High-Intensity Interval Training (HIIT)", "Long-Slow Distance (LSD) Cardio", "Fartlek Training"],
    chest: ["Bench Press", "Incline Dumbbell Press", "Push-ups", "Chest Flys"],
    back: ["Pull-ups", "Deadlifts", "Bent-over Rows", "Lat Pulldowns"],
    legs: ["Squats", "Lunges", "Leg Press", "Romanian Deadlifts", "Calf Raises"],
    shoulders: ["Overhead Press", "Lateral Raises", "Front Raises", "Face Pulls"],
    arms: ["Bicep Curls", "Tricep Dips", "Hammer Curls", "Tricep Pushdowns"],
    core: ["Plank", "Crunches", "Leg Raises", "Russian Twists", "Hanging Knee Raises"],
    flexibility: ["Yoga", "Dynamic Stretching", "Static Stretching"]
};

const workoutStructure = {
    lose: ["cardio", ["chest", "back"], "cardio", "legs", ["shoulders", "arms"], "core", "flexibility"],
    gain: [["chest", "arms"], "legs", "back", ["shoulders", "core"], "legs", "rest", "rest"],
    fit: [["chest", "back"], "legs", "cardio", ["shoulders", "arms"], "core", "flexibility", "rest"]
};

function generateWorkoutPlan(goal, activity) {
    const plan = {};
    const structure = workoutStructure[goal];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    for (let i = 0; i < days.length; i++) {
        const dayType = structure[i];
        if (dayType === "rest") {
            plan[days[i]] = "Rest Day";
        } else if (Array.isArray(dayType)) {
            plan[days[i]] = `Strength: ${getRandomItem(exercises[dayType[0]])}, ${getRandomItem(exercises[dayType[1]])}, ${getRandomItem(exercises.core)} (${getSetsReps(goal, activity)})`;
        } else {
            plan[days[i]] = `${capitalize(dayType)}: ${getRandomItem(exercises[dayType])} (${getDuration(dayType, activity)})`;
        }
    }
    plan.explanation = getWorkoutExplanation(goal);
    return plan;
}

function getSetsReps(goal, activity) {
    if (goal === 'gain') return activity === 'high' ? "5 sets of 6-8 reps" : "4 sets of 8-10 reps";
    if (goal === 'lose') return activity === 'high' ? "4 sets of 12-15 reps" : "3 sets of 15-20 reps";
    return "3 sets of 10-12 reps";
}

function getDuration(type, activity) {
    if (type === 'cardio') {
        if (activity === 'low') return "30 mins";
        if (activity === 'moderate') return "45 mins";
        if (activity === 'high') return "60 mins";
    }
    return "45-60 mins";
}

const mealOptions = {
    breakfast: ["Oatmeal with berries, nuts, and a scoop of protein powder", "Scrambled eggs (3) with spinach and a side of whole wheat toast", "Greek yogurt with granola, honey, and fresh fruit", "Protein smoothie with almond milk, banana, and spinach"],
    lunch: ["Grilled chicken breast salad with mixed greens, quinoa, and a light vinaigrette", "Large bowl of lentil soup with a side of whole grain bread", "Turkey and avocado wrap with a side of carrot sticks", "Salmon fillet with a side of brown rice and roasted broccoli"],
    dinner: ["Baked cod with sweet potato wedges and asparagus", "Lean ground beef stir-fry with mixed vegetables and brown rice", "Vegetarian chili loaded with beans and vegetables", "Chicken breast with a large side of mixed greens and balsamic vinaigrette", "Tofu and vegetable curry with basmati rice"],
    snacks: ["Apple slices with almond butter", "A handful of mixed nuts and seeds", "Protein shake", "Cottage cheese with pineapple chunks", "Two hard-boiled eggs", "Greek yogurt"]
};

function generateDietPlan(calories, goal) {
    const plan = {};
    plan["Breakfast"] = getRandomItem(mealOptions.breakfast) + ` (~${Math.round(calories * 0.25 / 50) * 50} kcal)`;
    plan["Lunch"] = getRandomItem(mealOptions.lunch) + ` (~${Math.round(calories * 0.35 / 50) * 50} kcal)`;
    plan["Dinner"] = getRandomItem(mealOptions.dinner) + ` (~${Math.round(calories * 0.30 / 50) * 50} kcal)`;
    plan["Snacks"] = `${getRandomItem(mealOptions.snacks)}, ${getRandomItem(mealOptions.snacks)}` + ` (~${Math.round(calories * 0.10 / 50) * 50} kcal)`;
    plan["Estimated Daily Calories"] = `~${calories} kcal`;
    plan.explanation = getDietExplanation(goal, calories);
    return plan;
}

function getWorkoutExplanation(goal) {
    const explanations = {
        lose: "This plan focuses on high-intensity workouts and cardio to maximize calorie burn and fat loss, while also including strength training to maintain muscle mass.",
        gain: "This plan emphasizes heavy compound lifts and progressive overload to stimulate muscle growth. Rest days are crucial for muscle recovery and repair.",
        fit: "This plan provides a balanced mix of strength, cardio, and flexibility to maintain your current fitness level and improve overall health and well-being."
    };
    return explanations[goal];
}

function getDietExplanation(goal, calories) {
    const explanations = {
        lose: `This diet is designed to be in a calorie deficit of approximately 500 calories per day to promote gradual and sustainable weight loss. It is high in protein to help you feel full and maintain muscle.`,
        gain: `This diet provides a calorie surplus of approximately 500 calories per day to support muscle growth. It is rich in protein and complex carbohydrates to fuel your workouts and aid in recovery.`,
        fit: `This diet is designed to provide you with the right balance of macronutrients to maintain your current weight and support an active lifestyle. It is focused on whole, nutrient-dense foods.`
    };
    return explanations[goal];
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateWeeklySchedule(workoutPlan, dietPlan) {
    let schedule = '<h3>Weekly Schedule</h3><table>';
    schedule += '<tr><th>Day</th><th>Workout</th><th>Diet Summary</th></tr>';
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    for (const day of days) {
        schedule += `<tr>
            <td>${day}</td>
            <td>${workoutPlan[day]}</td>
            <td>${dietPlan["Breakfast"]}, ${dietPlan["Lunch"]}, ${dietPlan["Dinner"]}, ${dietPlan["Snacks"]}</td>
        </tr>`;
    }
    schedule += '</table>';
    return schedule;
}

function displayResults(bmi, calories, water, workoutPlan, dietPlan, weeklySchedule) {
    const bmiResult = document.getElementById('bmi-result');
    const workoutPlanDiv = document.getElementById('workout-plan');
    const dietPlanDiv = document.getElementById('diet-plan');
    const weeklyScheduleDiv = document.getElementById('weekly-schedule');

    let bmiCategory;
    if (bmi < 18.5) bmiCategory = "Underweight";
    else if (bmi >= 18.5 && bmi < 24.9) bmiCategory = "Normal weight";
    else if (bmi >= 25 && bmi < 29.9) bmiCategory = "Overweight";
    else bmiCategory = "Obesity";

    bmiResult.innerHTML = `<h3>Your Results</h3>
                           <p><strong>BMI:</strong> ${bmi} (${bmiCategory})</p>
                           <p><strong>Suggested Daily Calorie Intake:</strong> ${calories} kcal</p>
                           <p><strong>Recommended Daily Water Intake:</strong> ${water} ml</p>`;

    let workoutHTML = '<h3>Your 7-Day Workout Plan</h3>';
    workoutHTML += `<p><em>${workoutPlan.explanation}</em></p><ul>`;
    for (const day in workoutPlan) {
        if (day !== 'explanation') {
            workoutHTML += `<li><strong>${day}:</strong> ${workoutPlan[day]}</li>`;
        }
    }
    workoutHTML += '</ul>';
    workoutPlanDiv.innerHTML = workoutHTML;

    let dietHTML = '<h3>Your Sample Diet Plan</h3>';
    dietHTML += `<p><em>${dietPlan.explanation}</em></p><ul>`;
    for (const meal in dietPlan) {
        if (meal !== 'explanation') {
            dietHTML += `<li><strong>${meal}:</strong> ${dietPlan[meal]}</li>`;
        }
    }
    dietHTML += '</ul>';
    dietPlanDiv.innerHTML = dietHTML;

    weeklyScheduleDiv.innerHTML = weeklySchedule;

    document.getElementById('output-section').classList.remove('hidden');

    // This animation will now be triggered by the GSAP scrollTrigger
    // gsap.from('.output-card', {
    //     y: 50,
    //     opacity: 0,
    //     duration: 1,
    //     stagger: 0.2
    // });
}