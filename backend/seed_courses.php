<?php

require_once __DIR__ . '/app/config/database.php';

// Course data to seed
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

try {
    $db = getMongoConnection();
    $collection = $db->courses;
    
    // Clear existing courses (optional - comment out if you want to keep existing data)
    echo "Clearing existing courses...\n";
    $collection->deleteMany([]);
    
    // Drop the unique index on course_code if it exists
    try {
        $collection->dropIndex('course_code_1');
        echo "Dropped old course_code index\n";
    } catch (Exception $e) {
        // Index doesn't exist, that's fine
    }
    
    // Insert courses
    echo "Inserting courses...\n\n";
    $insertedCount = 0;
    
    foreach ($courses as $course) {
        $course['created_at'] = new MongoDB\BSON\UTCDateTime();
        $course['updated_at'] = new MongoDB\BSON\UTCDateTime();
        
        $result = $collection->insertOne($course);
        
        if ($result->getInsertedId()) {
            $insertedCount++;
            echo "✓ Inserted: {$course['title']}\n";
        }
    }
    
    echo "\n";
    echo "========================================\n";
    echo "Seeding completed successfully!\n";
    echo "Total courses inserted: {$insertedCount}\n";
    echo "========================================\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
