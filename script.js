// JavaScript Code - Makes the app interactive

// Store all jobs in memory
let jobs = [];
let jobIdCounter = 1;

// Get references to important elements from HTML
const jobForm = document.getElementById('jobForm');
const jobsGrid = document.getElementById('jobsGrid');
const filterButtons = document.querySelectorAll('.filter-btn');

// Add event listeners when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Listen for form submission
    jobForm.addEventListener('submit', addJob);
    
    // Listen for filter button clicks
    filterButtons.forEach(btn => btn.addEventListener('click', filterJobs));
    
    // Initialize the app
    initApp();
});

// Function to add a new job
function addJob(e) {
    e.preventDefault(); // Prevents page from refreshing
    
    // Get form data and create job object
    const jobData = {
        id: jobIdCounter++,
        company: document.getElementById('company').value,
        position: document.getElementById('position').value,
        location: document.getElementById('location').value,
        salary: document.getElementById('salary').value,
        status: document.getElementById('status').value,
        appliedDate: document.getElementById('appliedDate').value,
        notes: document.getElementById('notes').value,
        dateAdded: new Date().toLocaleDateString()
    };
    
    // Add to jobs array
    jobs.push(jobData);
    
    // Reset form fields
    jobForm.reset();
    document.getElementById('appliedDate').value = new Date().toISOString().split('T')[0];
    
    // Update the display
    displayJobs();
    updateStats();
    
    // Show success message
    alert('Job application added successfully! 🎉');
}

// Function to display jobs on the page
function displayJobs(filter = 'all') {
    // Filter jobs based on selected status
    let filteredJobs = jobs;
    if (filter !== 'all') {
        filteredJobs = jobs.filter(job => job.status === filter);
    }

    // Clear the current display
    jobsGrid.innerHTML = '';

    // If no jobs found, show empty state
    if (filteredJobs.length === 0) {
        jobsGrid.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 4em;">📝</div>
                <h3>${filter === 'all' ? 'No job applications yet!' : `No ${filter} applications found!`}</h3>
                <p>${filter === 'all' ? 'Add your first job application above to get started.' : 'Try a different filter or add more applications.'}</p>
            </div>
        `;
        return;
    }

    // Create and display job cards
    filteredJobs.forEach(job => {
        const jobCard = createJobCard(job);
        jobsGrid.appendChild(jobCard);
    });
}

// Function to create a single job card
function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    
    // Build the HTML content for the card
    card.innerHTML = `
        <div class="job-company">${job.company}</div>
        <div class="job-position">${job.position}</div>
        
        <div class="job-details">
            ${job.location ? `<div class="job-detail"><span>Location:</span><span>${job.location}</span></div>` : ''}
            ${job.salary ? `<div class="job-detail"><span>Salary:</span><span>${job.salary}</span></div>` : ''}
            ${job.appliedDate ? `<div class="job-detail"><span>Applied:</span><span>${formatDate(job.appliedDate)}</span></div>` : ''}
            <div class="job-detail">
                <span>Status:</span>
                <span class="status-badge status-${job.status}">${formatStatus(job.status)}</span>
            </div>
        </div>
        
        ${job.notes ? `<div class="job-notes">"${job.notes}"</div>` : ''}
        
        <button class="delete-btn" onclick="deleteJob(${job.id})">🗑️ Delete</button>
    `;
    
    return card;
}

// Function to delete a job
function deleteJob(jobId) {
    if (confirm('Are you sure you want to delete this job application?')) {
        // Remove job from array
        jobs = jobs.filter(job => job.id !== jobId);
        
        // Update display
        displayJobs();
        updateStats();
    }
}

// Function to handle filter button clicks
function filterJobs(e) {
    // Update active button styling
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Get filter type and display filtered jobs
    const filter = e.target.dataset.filter;
    displayJobs(filter);
}

// Function to update statistics
function updateStats() {
    const total = jobs.length;
    const interviews = jobs.filter(job => job.status === 'interview').length;
    const offers = jobs.filter(job => job.status === 'offer').length;
    const rejected = jobs.filter(job => job.status === 'rejected').length;
    
    // Update the numbers in HTML
    document.getElementById('totalJobs').textContent = total;
    document.getElementById('interviewJobs').textContent = interviews;
    document.getElementById('offerJobs').textContent = offers;
    document.getElementById('rejectedJobs').textContent = rejected;
}

// Helper function to format status text
function formatStatus(status) {
    const statusMap = {
        'applied': 'Applied',
        'interview': 'Interview',
        'offer': 'Offer',
        'rejected': 'Rejected'
    };
    return statusMap[status] || status;
}

// Helper function to format dates
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Initialize the app
function initApp() {
    // Set today's date as default in the form
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appliedDate').value = today;
    
    // Display initial state
    displayJobs();
    updateStats();
}