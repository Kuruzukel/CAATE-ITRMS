<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seed Courses Database</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #696cff;
            padding-bottom: 10px;
        }
        .btn {
            background-color: #696cff;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 5px;
        }
        .btn:hover {
            background-color: #5a5ecf;
        }
        .btn-danger {
            background-color: #ff3e1d;
        }
        .btn-danger:hover {
            background-color: #e63516;
        }
        .output {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 15px;
            margin-top: 20px;
            white-space: pre-wrap;
            font-family: monospace;
            max-height: 400px;
            overflow-y: auto;
        }
        .success {
            color: #28a745;
        }
        .error {
            color: #dc3545;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌱 Seed Courses Database</h1>
        
        <div class="warning">
            <strong>⚠️ Warning:</strong> This will clear all existing courses and insert 10 new courses into the database.
        </div>

        <form method="POST">
            <button type="submit" name="action" value="seed" class="btn">
                🚀 Seed Database
            </button>
            <button type="submit" name="action" value="clear" class="btn btn-danger">
                🗑️ Clear All Courses
            </button>
        </form>

        <?php
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            require_once __DIR__ . '/../app/config/database.php';
            
            $action = $_POST['action'] ?? '';
            
            echo '<div class="output">';
            
            try {
                $db = getMongoConnection();
                $collection = $db->courses;
                
                if ($action === 'clear') {
                    echo "Clearing all courses...\n";
                    $result = $collection->deleteMany([]);
                    echo "<span class='success'>✓ Deleted {$result->getDeletedCount()} courses</span>\n";
                    
                } elseif ($action === 'seed') {
                    // Drop the unique index on course_code if it exists
                    try {
                        $collection->dropIndex('course_code_1');
                        echo "Dropped old course_code index\n";
                    } catch (Exception $e) {
                        // Index doesn't exist, that's fine
                    }
                    
                    // Course data
                    $courses = [
                        [
                            'badge' => 'NC II - SOCBCN220',
                            'course_code' => 'NC II - SOCBCN220',
                            'title' => 'Beauty Care (Nail Care) Services NC II',
                            'description' => 'Master professional nail care techniques including manicure, pedicure, nail art, and enhancement services.',
                            'hours' => '307 Hours (39 Days)',
                            'duration' => '307 Hours (39 Days)',
                            'image' => 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=250&fit=crop'
                        ],
                        [
                            'badge' => 'NC II - SOCBEC219',
                            'course_code' => 'NC II - SOCBEC219',
                            'title' => 'Beauty Care (Skin Care) Services NC II',
                            'description' => 'Develop expertise in professional skincare treatments, facial therapies, and comprehensive skin analysis techniques.',
                            'hours' => '421 Hours (53 Days)',
                            'duration' => '421 Hours (53 Days)',
                            'image' => 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=400&h=250&fit=crop'
                        ],
                        [
                            'badge' => 'Level III',
                            'course_code' => 'AESTHETIC-L3',
                            'title' => 'Aesthetic Services Level III',
                            'description' => 'Advance your career with comprehensive aesthetic services training and modern beauty technologies.',
                            'hours' => '80 Hours (10 Days)',
                            'duration' => '80 Hours (10 Days)',
                            'image' => 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=250&fit=crop'
                        ],
                        [
                            'badge' => 'Level III',
                            'course_code' => 'SKINCARE-ADV-L3',
                            'title' => 'Advanced Skin Care Services Level III',
                            'description' => 'Master specialized techniques in anti-aging treatments, corrective skincare, and clinical-grade procedures.',
                            'hours' => '100 Hours (13 Days)',
                            'duration' => '100 Hours (13 Days)',
                            'image' => 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=250&fit=crop'
                        ],
                        [
                            'badge' => 'Level III',
                            'course_code' => 'MAKEUP-TATTOO-L3',
                            'title' => 'Permanent Make-Up Tattoo Services Level III',
                            'description' => 'Learn precision techniques for eyebrow microblading, eyeliner tattooing, and lip pigmentation services.',
                            'hours' => '100 Hours (13 Days)',
                            'duration' => '100 Hours (13 Days)',
                            'image' => 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=250&fit=crop'
                        ],
                        [
                            'badge' => 'Specialized',
                            'course_code' => 'COLLAGEN-SPEC',
                            'title' => 'Perform Collagen Induction Therapy & Hair Loss Treatment',
                            'description' => 'Master advanced microneedling techniques for skin rejuvenation and evidence-based hair loss treatments.',
                            'hours' => '8 Hours (1 Day)',
                            'duration' => '8 Hours (1 Day)',
                            'image' => 'https://northshoremedicalclinic.ca/wp-content/uploads/2022/05/PRP-for-Hair-Loss.jpg'
                        ],
                        [
                            'badge' => 'Specialized',
                            'course_code' => 'FACIAL-PEELING-SPEC',
                            'title' => 'Perform Advanced Facial Treatment & Chemical Skin Peeling',
                            'description' => 'Gain expertise in advanced facial protocols and controlled chemical exfoliation for skin transformation.',
                            'hours' => '16 Hours (2 Days)',
                            'duration' => '16 Hours (2 Days)',
                            'image' => 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=250&fit=crop'
                        ],
                        [
                            'badge' => 'Specialized',
                            'course_code' => 'LIGHT-HEAT-SPEC',
                            'title' => 'Perform Light Therapy & Heat Therapy',
                            'description' => 'Master LED therapy, infrared treatments, and thermal modalities for skin rejuvenation and healing.',
                            'hours' => '16 Hours (2 Days)',
                            'duration' => '16 Hours (2 Days)',
                            'image' => 'https://omyguard.com/cdn/shop/articles/What_are_the_benefits_and_differences_of_blue_light_therapy_and_red_light_therapy.png?v=1721188964&width=1000'
                        ],
                        [
                            'badge' => 'Level I',
                            'course_code' => 'TRAINERS-L1',
                            'title' => 'Trainers Methodology Level I',
                            'description' => 'Develop essential training and facilitation skills to become a certified TESDA beauty educator.',
                            'hours' => '264 Hours (33 Days)',
                            'duration' => '264 Hours (33 Days)',
                            'image' => 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop'
                        ],
                        [
                            'badge' => 'Level III',
                            'course_code' => 'EYELASH-BROW-L3',
                            'title' => 'Eyelash and Eyebrow Services Level III',
                            'description' => 'Perfect eyelash extensions, lash lifting, brow lamination, tinting, and professional shaping techniques.',
                            'hours' => '80 Hours (10 Days)',
                            'duration' => '80 Hours (10 Days)',
                            'image' => 'https://tse3.mm.bing.net/th/id/OIP.f7lQ7Rt0CCBsxUWqGsYPwQHaE8?pid=Api&P=0&h=180'
                        ]
                    ];
                    
                    echo "Clearing existing courses...\n";
                    $collection->deleteMany([]);
                    
                    echo "Inserting courses...\n\n";
                    $insertedCount = 0;
                    
                    foreach ($courses as $course) {
                        $course['created_at'] = new MongoDB\BSON\UTCDateTime();
                        $course['updated_at'] = new MongoDB\BSON\UTCDateTime();
                        
                        $result = $collection->insertOne($course);
                        
                        if ($result->getInsertedId()) {
                            $insertedCount++;
                            echo "<span class='success'>✓ Inserted: {$course['title']}</span>\n";
                        }
                    }
                    
                    echo "\n========================================\n";
                    echo "<span class='success'>Seeding completed successfully!</span>\n";
                    echo "Total courses inserted: {$insertedCount}\n";
                    echo "========================================\n";
                }
                
            } catch (Exception $e) {
                echo "<span class='error'>Error: " . $e->getMessage() . "</span>\n";
            }
            
            echo '</div>';
        }
        ?>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <h3>Next Steps:</h3>
            <ol>
                <li>After seeding, visit the <a href="../../admin/src/pages/courses.html">Admin Courses Page</a></li>
                <li>The courses will be loaded dynamically from the database</li>
                <li>You can edit courses using the Edit button on each course card</li>
            </ol>
        </div>
    </div>
</body>
</html>
