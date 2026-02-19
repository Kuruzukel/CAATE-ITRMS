# Adding "Create New Course" Feature with Image Upload

## Overview

This guide shows how to add a "Create Course" button and modal to allow adding new courses with images.

## Implementation Steps

### Step 1: Add "Create Course" Button to HTML

Add this button before the courses grid in `courses.html`:

```html
<!-- Add after the loading spinner, before coursesGrid -->
<div class="d-flex justify-content-between align-items-center mb-4">
  <h4 class="fw-bold">Training Courses</h4>
  <button
    class="btn btn-primary"
    data-bs-toggle="modal"
    data-bs-target="#createCourseModal"
  >
    <i class="bx bx-plus me-2"></i>Add New Course
  </button>
</div>
```

### Step 2: Add Create Course Modal

Add this modal after the Edit Course Modal in `courses.html`:

```html
<!-- Create Course Modal -->
<div class="modal fade" id="createCourseModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Create New Course</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <form id="createCourseForm">
          <div class="row">
            <!-- Left Column - Form Fields -->
            <div class="col-md-7">
              <div class="mb-3">
                <label for="createCourseBadge" class="form-label"
                  >Course Code/Badge</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="createCourseBadge"
                  placeholder="e.g., NC II - SOCBCN220"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="createCourseTitle" class="form-label"
                  >Course Title</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="createCourseTitle"
                  placeholder="e.g., Beauty Care (Nail Care) Services NC II"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="createCourseDescription" class="form-label"
                  >Course Description</label
                >
                <textarea
                  class="form-control"
                  id="createCourseDescription"
                  rows="4"
                  placeholder="Enter course description..."
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="createCourseHours" class="form-label"
                  >Duration</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="createCourseHours"
                  placeholder="e.g., 307 Hours (39 Days)"
                  required
                />
              </div>
            </div>

            <!-- Right Column - Image Upload & Preview -->
            <div class="col-md-5">
              <div class="mb-3">
                <label class="form-label">Upload Image</label>
                <div class="upload-area" id="createUploadArea">
                  <i
                    class="bx bx-cloud-upload"
                    style="font-size: 2rem; color: #3b82f6;"
                  ></i>
                  <p class="mt-2 mb-0">
                    Drag and drop your image here or click to select
                  </p>
                  <small class="text-muted"
                    >Supported formats: JPG, PNG, GIF (Max 5MB)</small
                  >
                  <input
                    type="file"
                    id="createImageInput"
                    accept="image/*"
                    style="display: none;"
                  />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Image Preview</label>
                <div
                  id="createImagePreviewSection"
                  class="image-preview-section"
                >
                  <div class="image-preview-container">
                    <div id="createNoImageText" class="text-muted text-center">
                      <i
                        class="bx bx-image-alt"
                        style="font-size: 3rem; opacity: 0.3;"
                      ></i>
                      <p class="mt-2 mb-0">No image selected</p>
                      <small>Upload an image to see preview</small>
                    </div>
                    <img
                      id="createImagePreview"
                      class="image-preview"
                      style="display: none;"
                    />
                    <div
                      class="image-action-buttons"
                      style="display: none;"
                      id="createImageActionButtons"
                    >
                      <button
                        type="button"
                        class="btn btn-sm btn-primary image-view-btn"
                        id="createViewImageBtn"
                      >
                        <i class="bx bx-show"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-danger image-remove-btn"
                        id="createRemoveImageBtn"
                      >
                        <i class="bx bx-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-outline-secondary"
          data-bs-dismiss="modal"
        >
          Cancel
        </button>
        <button type="button" class="btn btn-primary" id="createCourseBtn">
          Create Course
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Create Image Preview Modal -->
<div
  class="modal fade"
  id="createImagePreviewModal"
  tabindex="-1"
  aria-hidden="true"
>
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">
          <i class="bx bx-image me-2 text-primary"></i>Image Preview
        </h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body text-center">
        <img
          id="createModalImagePreview"
          class="img-fluid rounded"
          style="max-height: 70vh; object-fit: contain;"
        />
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
          <i class="bx bx-x me-2"></i>Close
        </button>
      </div>
    </div>
  </div>
</div>
```

### Step 3: Add JavaScript for Create Course

Add this code to `courses.js`:

```javascript
// State for create modal
let createImageFile = null;

// Add to DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  // ... existing code ...

  // Initialize create image upload
  initializeCreateImageUpload();

  // Create course button handler
  document
    .getElementById("createCourseBtn")
    .addEventListener("click", async function () {
      const badge = document.getElementById("createCourseBadge").value.trim();
      const title = document.getElementById("createCourseTitle").value.trim();
      const description = document
        .getElementById("createCourseDescription")
        .value.trim();
      const hours = document.getElementById("createCourseHours").value.trim();

      if (!badge || !title || !description || !hours) {
        showToast("Please fill in all required fields", "error");
        return;
      }

      const courseData = {
        badge: badge,
        title: title,
        description: description,
        hours: hours,
      };

      // If image was uploaded, convert to base64
      if (createImageFile) {
        const reader = new FileReader();
        reader.onload = async function (e) {
          courseData.image = e.target.result;
          await createCourse(courseData);
        };
        reader.readAsDataURL(createImageFile);
      } else {
        courseData.image = "";
        await createCourse(courseData);
      }
    });

  // Reset form when modal is closed
  document
    .getElementById("createCourseModal")
    .addEventListener("hidden.bs.modal", function () {
      document.getElementById("createCourseForm").reset();
      resetCreateImagePreview();
      createImageFile = null;
    });
});

// Create course function
async function createCourse(courseData) {
  const createBtn = document.getElementById("createCourseBtn");
  const originalText = createBtn.innerHTML;

  try {
    createBtn.disabled = true;
    createBtn.innerHTML =
      '<i class="bx bx-loader-alt bx-spin me-2"></i>Creating...';

    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
    });

    const result = await response.json();

    if (result.success) {
      await loadCourses();

      const modal = bootstrap.Modal.getInstance(
        document.getElementById("createCourseModal"),
      );
      modal.hide();

      showToast("Course created successfully!", "success");
    } else {
      showToast(result.error || "Failed to create course", "error");
    }
  } catch (error) {
    console.error("Error creating course:", error);
    showToast("Error creating course. Please try again.", "error");
  } finally {
    createBtn.disabled = false;
    createBtn.innerHTML = originalText;
  }
}

// Initialize create image upload
function initializeCreateImageUpload() {
  const uploadArea = document.getElementById("createUploadArea");
  const imageInput = document.getElementById("createImageInput");
  const imagePreview = document.getElementById("createImagePreview");
  const noImageText = document.getElementById("createNoImageText");
  const imageActionButtons = document.getElementById(
    "createImageActionButtons",
  );
  const viewImageBtn = document.getElementById("createViewImageBtn");
  const removeImageBtn = document.getElementById("createRemoveImageBtn");

  uploadArea.addEventListener("click", () => imageInput.click());

  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) handleCreateImageFile(file);
  });

  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.classList.add("dragover");
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragover");
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleCreateImageFile(file);
    }
  });

  viewImageBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const imgSrc = imagePreview.src;
    if (imgSrc) {
      document.getElementById("createModalImagePreview").src = imgSrc;
      const modal = new bootstrap.Modal(
        document.getElementById("createImagePreviewModal"),
      );
      modal.show();
    }
  });

  removeImageBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    resetCreateImagePreview();
    createImageFile = null;
    imageInput.value = "";
  });
}

// Handle create image file
function handleCreateImageFile(file) {
  if (file.size > 5 * 1024 * 1024) {
    showToast("Image size must be less than 5MB", "error");
    return;
  }

  if (!file.type.startsWith("image/")) {
    showToast("Please select a valid image file", "error");
    return;
  }

  createImageFile = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    const imagePreview = document.getElementById("createImagePreview");
    const noImageText = document.getElementById("createNoImageText");
    const imageActionButtons = document.getElementById(
      "createImageActionButtons",
    );

    imagePreview.src = e.target.result;
    imagePreview.style.display = "block";
    noImageText.style.display = "none";
    imageActionButtons.style.display = "flex";
  };
  reader.readAsDataURL(file);
}

// Reset create image preview
function resetCreateImagePreview() {
  const imagePreview = document.getElementById("createImagePreview");
  const noImageText = document.getElementById("createNoImageText");
  const imageActionButtons = document.getElementById(
    "createImageActionButtons",
  );

  imagePreview.src = "";
  imagePreview.style.display = "none";
  noImageText.style.display = "block";
  imageActionButtons.style.display = "none";
}
```

### Step 4: Verify Backend Support

The backend already supports creating courses via POST request. Verify in `CourseController.php`:

```php
public function store() {
    // This method already exists and handles POST requests
    // It accepts all course data including the image field
}
```

### Step 5: Update Routes (if needed)

Verify the route exists in `backend/routes/api.php`:

```php
// POST /api/v1/courses - Create new course
if ($method === 'POST' && $path === '/courses') {
    $controller->store();
    exit;
}
```

## Testing the Create Feature

1. Open courses.html
2. Click "Add New Course" button
3. Fill in all fields
4. Upload an image
5. Click "Create Course"
6. Verify new course appears in the grid

## Benefits of This Feature

- ✅ Add courses without database access
- ✅ Upload images during creation
- ✅ Same validation as edit modal
- ✅ Consistent user experience
- ✅ No need for seed scripts

## Optional Enhancements

### Add Delete Course Feature

```javascript
// Add delete button to course cards
<button
  class="btn btn-sm btn-outline-danger delete-course-btn"
  data-id="${courseId}"
>
  <i class="bx bx-trash"></i> Delete
</button>;

// Add delete handler
document.addEventListener("click", async function (e) {
  if (e.target.closest(".delete-course-btn")) {
    const btn = e.target.closest(".delete-course-btn");
    const courseId = btn.dataset.id;

    if (confirm("Are you sure you want to delete this course?")) {
      await deleteCourse(courseId);
    }
  }
});

async function deleteCourse(courseId) {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (result.success) {
      await loadCourses();
      showToast("Course deleted successfully!", "success");
    } else {
      showToast(result.error || "Failed to delete course", "error");
    }
  } catch (error) {
    console.error("Error deleting course:", error);
    showToast("Error deleting course. Please try again.", "error");
  }
}
```

### Add Search/Filter

```html
<input
  type="text"
  id="courseSearch"
  class="form-control"
  placeholder="Search courses..."
/>
```

```javascript
document.getElementById("courseSearch").addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      course.badge.toLowerCase().includes(searchTerm),
  );
  renderCourses(filteredCourses);
});
```

## Summary

With these additions, you'll have a complete CRUD interface for courses:

- ✅ Create (with image upload)
- ✅ Read (display courses)
- ✅ Update (with image upload)
- ✅ Delete (optional)

All with image upload support and proper validation!
