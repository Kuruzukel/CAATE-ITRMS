<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../app/config/database.php';

$db = getMongoConnection();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CAATE-ITRMS Database Viewer</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .header {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            margin-bottom: 30px;
            text-align: center;
        }
        
        .header h1 {
            color: #667eea;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #666;
            font-size: 1.1em;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
        }
        
        .stat-card h3 {
            color: #667eea;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .stat-card p {
            color: #666;
            font-size: 1em;
        }
        
        .section {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            margin-bottom: 30px;
        }
        
        .section h2 {
            color: #667eea;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        
        th {
            background: #667eea;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }
        
        td {
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
        }
        
        tr:hover {
            background: #f8f9ff;
        }
        
        .badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
        }
        
        .badge-active {
            background: #d4edda;
            color: #155724;
        }
        
        .badge-pending {
            background: #fff3cd;
            color: #856404;
        }
        
        .badge-paid {
            background: #d1ecf1;
            color: #0c5460;
        }
        
        .badge-partial {
            background: #f8d7da;
            color: #721c24;
        }
        
        .no-data {
            text-align: center;
            padding: 40px;
            color: #999;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 CAATE-ITRMS Database</h1>
            <p>Integrated Training & Resource Management System</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <h3><?php echo $db->users->countDocuments(); ?></h3>
                <p>Users</p>
            </div>
            <div class="stat-card">
                <h3><?php echo $db->trainees->countDocuments(); ?></h3>
                <p>Trainees</p>
            </div>
            <div class="stat-card">
                <h3><?php echo $db->courses->countDocuments(); ?></h3>
                <p>Courses</p>
            </div>
            <div class="stat-card">
                <h3><?php echo $db->enrollments->countDocuments(); ?></h3>
                <p>Enrollments</p>
            </div>
            <div class="stat-card">
                <h3><?php echo $db->inventory->countDocuments(); ?></h3>
                <p>Inventory Items</p>
            </div>
            <div class="stat-card">
                <h3><?php echo $db->applications->countDocuments(); ?></h3>
                <p>Applications</p>
            </div>
            <div class="stat-card">
                <h3><?php echo $db->graduates->countDocuments(); ?></h3>
                <p>Graduates</p>
            </div>
        </div>
        
        <!-- Users Section -->
        <div class="section">
            <h2>👥 Users</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Phone</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $users = $db->users->find();
                    foreach ($users as $user) {
                        echo "<tr>";
                        echo "<td>{$user['name']}</td>";
                        echo "<td>{$user['email']}</td>";
                        echo "<td><span class='badge badge-active'>{$user['role']}</span></td>";
                        echo "<td>{$user['phone']}</td>";
                        echo "<td><span class='badge badge-active'>Active</span></td>";
                        echo "</tr>";
                    }
                    ?>
                </tbody>
            </table>
        </div>
        
        <!-- Courses Section -->
        <div class="section">
            <h2>📚 Courses</h2>
            <table>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Title</th>
                        <th>Duration</th>
                        <th>Fee</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $courses = $db->courses->find();
                    foreach ($courses as $course) {
                        echo "<tr>";
                        echo "<td><strong>{$course['course_code']}</strong></td>";
                        echo "<td>{$course['title']}</td>";
                        echo "<td>{$course['duration']}</td>";
                        echo "<td>₱" . number_format($course['fee'], 2) . "</td>";
                        echo "<td><span class='badge badge-active'>{$course['status']}</span></td>";
                        echo "</tr>";
                    }
                    ?>
                </tbody>
            </table>
        </div>
        
        <!-- Trainees Section -->
        <div class="section">
            <h2>🎓 Trainees</h2>
            <table>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $trainees = $db->trainees->find();
                    foreach ($trainees as $trainee) {
                        echo "<tr>";
                        echo "<td><strong>{$trainee['trainee_id']}</strong></td>";
                        echo "<td>{$trainee['first_name']} {$trainee['last_name']}</td>";
                        echo "<td>{$trainee['email']}</td>";
                        echo "<td>{$trainee['phone']}</td>";
                        echo "<td><span class='badge badge-active'>{$trainee['status']}</span></td>";
                        echo "</tr>";
                    }
                    ?>
                </tbody>
            </table>
        </div>
        
        <!-- Enrollments Section -->
        <div class="section">
            <h2>📝 Enrollments</h2>
            <table>
                <thead>
                    <tr>
                        <th>Trainee ID</th>
                        <th>Course ID</th>
                        <th>Enrollment Date</th>
                        <th>Payment Status</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $enrollments = $db->enrollments->find();
                    foreach ($enrollments as $enrollment) {
                        $date = $enrollment['enrollment_date']->toDateTime()->format('Y-m-d');
                        $paymentBadge = $enrollment['payment_status'] == 'paid' ? 'badge-paid' : 'badge-partial';
                        echo "<tr>";
                        echo "<td>{$enrollment['trainee_id']}</td>";
                        echo "<td>{$enrollment['course_id']}</td>";
                        echo "<td>{$date}</td>";
                        echo "<td><span class='badge {$paymentBadge}'>{$enrollment['payment_status']}</span></td>";
                        echo "<td><span class='badge badge-active'>{$enrollment['status']}</span></td>";
                        echo "</tr>";
                    }
                    ?>
                </tbody>
            </table>
        </div>
        
        <!-- Inventory Section -->
        <div class="section">
            <h2>📦 Inventory</h2>
            <table>
                <thead>
                    <tr>
                        <th>Item Code</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $inventory = $db->inventory->find();
                    foreach ($inventory as $item) {
                        echo "<tr>";
                        echo "<td><strong>{$item['item_code']}</strong></td>";
                        echo "<td>{$item['name']}</td>";
                        echo "<td>{$item['category']}</td>";
                        echo "<td>{$item['quantity']} {$item['unit']}</td>";
                        echo "<td>₱" . number_format($item['price'], 2) . "</td>";
                        echo "<td><span class='badge badge-active'>{$item['status']}</span></td>";
                        echo "</tr>";
                    }
                    ?>
                </tbody>
            </table>
        </div>
        
        <!-- Applications Section -->
        <div class="section">
            <h2>📋 Applications</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Course Interest</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $applications = $db->applications->find();
                    foreach ($applications as $app) {
                        $statusBadge = $app['status'] == 'pending' ? 'badge-pending' : 'badge-active';
                        echo "<tr>";
                        echo "<td>{$app['first_name']} {$app['last_name']}</td>";
                        echo "<td>{$app['email']}</td>";
                        echo "<td>{$app['phone']}</td>";
                        echo "<td>{$app['course_interest']}</td>";
                        echo "<td><span class='badge {$statusBadge}'>{$app['status']}</span></td>";
                        echo "</tr>";
                    }
                    ?>
                </tbody>
            </table>
        </div>
        
        <!-- Graduates Section -->
        <div class="section">
            <h2>🎉 Graduates</h2>
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Course</th>
                        <th>Graduation Date</th>
                        <th>Certificate Number</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $graduates = $db->graduates->find();
                    foreach ($graduates as $grad) {
                        $date = $grad['graduation_date']->toDateTime()->format('Y-m-d');
                        echo "<tr>";
                        echo "<td><strong>{$grad['student_name']}</strong></td>";
                        echo "<td>{$grad['course_name']}</td>";
                        echo "<td>{$date}</td>";
                        echo "<td>{$grad['certificate_number']}</td>";
                        echo "</tr>";
                    }
                    ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
