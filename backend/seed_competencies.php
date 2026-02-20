<?php

require_once __DIR__ . '/app/config/database.php';

// Competencies data extracted from courses
$competencies = [
    // Course 1: Beauty Care (Nail Care) Services NC II
    [
        'course_code' => 'NC II - SOCBCN220',
        'course_title' => 'Beauty Care (Nail Care) Services NC II',
        'competency_type' => 'Basic',
        'competencies' => [
            'Participate in workplace communication',
            'Work in a team environment',
            'Practice career professionalism',
            'Practice occupational health and safety procedures'
        ]
    ],
    [
        'course_code' => 'NC II - SOCBCN220',
        'course_title' => 'Beauty Care (Nail Care) Services NC II',
        'competency_type' => 'Common',
        'competencies' => [
            'Maintain an effective relationship with clients/customers',
            'Manage own performance',
            'Apply quality standards',
            'Maintain a safe, clean and efficient environment'
        ]
    ],
    [
        'course_code' => 'NC II - SOCBCN220',
        'course_title' => 'Beauty Care (Nail Care) Services NC II',
        'competency_type' => 'Core',
        'competencies' => [
            'Perform manicure and pedicure',
            'Perform hand spa',
            'Perform foot spa'
        ]
    ],
    
    // Course 2: Beauty Care (Skin Care) Services NC II
    [
        'course_code' => 'NC II - SOCBEC219',
        'course_title' => 'Beauty Care (Skin Care) Services NC II',
        'competency_type' => 'Basic',
        'competencies' => [
            'Participate in workplace communication',
            'Work in a team environment',
            'Solve/address general workplace problems',
            'Develop career and life decisions',
            'Contribute to workplace innovation',
            'Present relevant information',
            'Practice occupational safety and health policies and procedures',
            'Exercise efficient and effective sustainable practices in the workplace',
            'Practice entrepreneurial skills in the workplace'
        ]
    ],
    [
        'course_code' => 'NC II - SOCBEC219',
        'course_title' => 'Beauty Care (Skin Care) Services NC II',
        'competency_type' => 'Common',
        'competencies' => [
            'Maintain an effective relationship with clients/customers',
            'Manage own performance',
            'Apply quality standards',
            'Maintain a safe, clean and efficient environment'
        ]
    ],
    [
        'course_code' => 'NC II - SOCBEC219',
        'course_title' => 'Beauty Care (Skin Care) Services NC II',
        'competency_type' => 'Core',
        'competencies' => [
            'Perform facial cleansing',
            'Perform temporary hair removal activity',
            'Perform body scrub'
        ]
    ],
    
    // Course 3: Aesthetic Services Level III
    [
        'course_code' => 'AESTHETIC-L3',
        'course_title' => 'Aesthetic Services Level III',
        'competency_type' => 'Basic',
        'competencies' => [
            'Lead workplace communication',
            'Lead small teams',
            'Apply critical thinking and problem-solving techniques in the workplace',
            'Work in a diverse environment',
            'Propose methods of applying learning and innovation in the organization',
            'Use information systematically',
            'Evaluate occupational safety and health work practices',
            'Evaluate environmental work practices',
            'Facilitate entrepreneurial skills for MSMEs'
        ]
    ],
    [
        'course_code' => 'AESTHETIC-L3',
        'course_title' => 'Aesthetic Services Level III',
        'competency_type' => 'Common',
        'competencies' => [
            'Maintain an effective relationship with clients/customers',
            'Manage own performance',
            'Apply quality standards',
            'Maintain a safe, clean and efficient work environment'
        ]
    ],
    [
        'course_code' => 'AESTHETIC-L3',
        'course_title' => 'Aesthetic Services Level III',
        'competency_type' => 'Core',
        'competencies' => [
            'Perform advanced facial treatment',
            'Perform chemical skin peeling',
            'Perform light therapy',
            'Perform heat therapy'
        ]
    ],
    
    // Course 4: Advanced Skin Care Services Level III
    [
        'course_code' => 'SKINCARE-ADV-L3',
        'course_title' => 'Advanced Skin Care Services Level III',
        'competency_type' => 'Basic',
        'competencies' => [
            'Lead workplace communication',
            'Lead small teams',
            'Apply critical thinking and problem-solving techniques in the workplace',
            'Work in a diverse environment',
            'Propose methods of applying learning and innovation in the organization',
            'Use information systematically',
            'Evaluate occupational safety and health work practices',
            'Evaluate environmental work practices',
            'Facilitate entrepreneurial skills for MSMEs'
        ]
    ],
    [
        'course_code' => 'SKINCARE-ADV-L3',
        'course_title' => 'Advanced Skin Care Services Level III',
        'competency_type' => 'Common',
        'competencies' => [
            'Maintain an effective relationship with clients/customers',
            'Manage own performance',
            'Apply quality standards',
            'Maintain a safe, clean and efficient work environment'
        ]
    ],
    [
        'course_code' => 'SKINCARE-ADV-L3',
        'course_title' => 'Advanced Skin Care Services Level III',
        'competency_type' => 'Core',
        'competencies' => [
            'Perform BB glow facial',
            'Perform collagen induction therapy',
            'Perform warts removal treatment',
            'Perform comedone extraction procedure',
            'Perform hair loss treatment therapy'
        ]
    ],
    
    // Course 5: Permanent Make-Up Tattoo Services Level III
    [
        'course_code' => 'MAKEUP-TATTOO-L3',
        'course_title' => 'Permanent Make-Up Tattoo Services Level III',
        'competency_type' => 'Basic',
        'competencies' => [
            'Lead workplace communication',
            'Lead small teams',
            'Apply critical thinking and problem-solving techniques in the workplace',
            'Work in a diverse environment',
            'Propose methods of applying learning and innovation in the organization',
            'Use information systematically',
            'Evaluate occupational safety and health work practices',
            'Evaluate environmental work practices',
            'Facilitate entrepreneurial skills for MSMEs'
        ]
    ],
    [
        'course_code' => 'MAKEUP-TATTOO-L3',
        'course_title' => 'Permanent Make-Up Tattoo Services Level III',
        'competency_type' => 'Common',
        'competencies' => [
            'Maintain an effective relationship with clients/customers',
            'Manage own performance',
            'Apply quality standards',
            'Maintain a safe, clean and efficient work environment'
        ]
    ],
    [
        'course_code' => 'MAKEUP-TATTOO-L3',
        'course_title' => 'Permanent Make-Up Tattoo Services Level III',
        'competency_type' => 'Core',
        'competencies' => [
            'Administer eyebrow pigmentation',
            'Administer eyeliner pigmentation',
            'Administer lip pigmentation',
            'Perform dermopigmentation removal procedure'
        ]
    ],
    
    // Course 6: Perform Collagen Induction Therapy & Hair Loss Treatment
    [
        'course_code' => 'COLLAGEN-SPEC',
        'course_title' => 'Perform Collagen Induction Therapy & Hair Loss Treatment',
        'competency_type' => 'Core',
        'competencies' => [
            'Perform collagen induction therapy',
            'Perform hair loss treatment therapy'
        ]
    ],
    
    // Course 7: Perform Advanced Facial Treatment & Chemical Skin Peeling
    [
        'course_code' => 'FACIAL-PEELING-SPEC',
        'course_title' => 'Perform Advanced Facial Treatment & Chemical Skin Peeling',
        'competency_type' => 'Core',
        'competencies' => [
            'Perform advance facial treatment',
            'Perform chemical skin peeling'
        ]
    ],
    
    // Course 8: Perform Light Therapy & Heat Therapy
    [
        'course_code' => 'LIGHT-HEAT-SPEC',
        'course_title' => 'Perform Light Therapy & Heat Therapy',
        'competency_type' => 'Core',
        'competencies' => [
            'Perform light therapy treatment',
            'Perform heat therapy treatment',
            'Apply LED therapy techniques',
            'Apply infrared treatment modalities'
        ]
    ],
    
    // Course 9: Trainers Methodology Level I
    [
        'course_code' => 'TRAINERS-L1',
        'course_title' => 'Trainers Methodology Level I',
        'competency_type' => 'Basic',
        'competencies' => [
            'Lead workplace communication',
            'Apply math and science principles in technical training',
            'Apply environmental principles and advocate conservation',
            'Utilize IT applications in technical training',
            'Lead small teams',
            'Apply work ethics, values and quality principles',
            'Work effectively in vocational education and training',
            'Foster and promote a learning culture',
            'Ensure healthy and safe learning environment',
            'Maintain and enhance professional practice',
            'Develop appreciation for cost-benefits of technical training',
            'Develop global understanding of labor markets'
        ]
    ],
    [
        'course_code' => 'TRAINERS-L1',
        'course_title' => 'Trainers Methodology Level I',
        'competency_type' => 'Core',
        'competencies' => [
            'Plan training sessions',
            'Facilitate learning sessions',
            'Supervise work-based learning',
            'Conduct competency assessment',
            'Maintain training facilities',
            'Utilize electronic media in facilitating training'
        ]
    ],
    
    // Course 10: Eyelash and Eyebrow Services Level III
    [
        'course_code' => 'EYELASH-BROW-L3',
        'course_title' => 'Eyelash and Eyebrow Services Level III',
        'competency_type' => 'Basic',
        'competencies' => [
            'Lead workplace communication',
            'Lead small teams',
            'Apply critical thinking and problem-solving techniques in the workplace',
            'Work in a diverse environment',
            'Propose methods of applying learning and innovation in the organization',
            'Use information systematically',
            'Evaluate occupational safety and health work practices',
            'Evaluate environmental work practices',
            'Facilitate entrepreneurial skills for micro-small-medium enterprises (MSMEs)'
        ]
    ],
    [
        'course_code' => 'EYELASH-BROW-L3',
        'course_title' => 'Eyelash and Eyebrow Services Level III',
        'competency_type' => 'Common',
        'competencies' => [
            'Maintain an effective relationship with clients/customers',
            'Manage own performance',
            'Apply quality standards',
            'Maintain a safe, clean and efficient work environment'
        ]
    ],
    [
        'course_code' => 'EYELASH-BROW-L3',
        'course_title' => 'Eyelash and Eyebrow Services Level III',
        'competency_type' => 'Core',
        'competencies' => [
            'Perform eyelash extensions and removal',
            'Perform eyelash lift and tint',
            'Perform eyebrow lamination and tint'
        ]
    ]
];

try {
    $db = getMongoConnection();
    $collection = $db->competencies;
    
    // Clear existing competencies (optional - comment out if you want to keep existing data)
    echo "Clearing existing competencies...\n";
    $collection->deleteMany([]);
    
    // Insert competencies
    echo "Inserting competencies...\n\n";
    $insertedCount = 0;
    
    foreach ($competencies as $competencyGroup) {
        // Create a document for each competency in the group
        foreach ($competencyGroup['competencies'] as $competency) {
            $document = [
                'course_code' => $competencyGroup['course_code'],
                'course_title' => $competencyGroup['course_title'],
                'competency_type' => $competencyGroup['competency_type'],
                'competency_name' => $competency,
                'created_at' => new MongoDB\BSON\UTCDateTime(),
                'updated_at' => new MongoDB\BSON\UTCDateTime()
            ];
            
            $result = $collection->insertOne($document);
            
            if ($result->getInsertedId()) {
                $insertedCount++;
                echo "✓ Inserted: [{$competencyGroup['competency_type']}] {$competency} - {$competencyGroup['course_title']}\n";
            }
        }
    }
    
    // Create indexes for better query performance
    echo "\nCreating indexes...\n";
    $collection->createIndex(['course_code' => 1]);
    $collection->createIndex(['competency_type' => 1]);
    $collection->createIndex(['course_code' => 1, 'competency_type' => 1]);
    echo "✓ Indexes created\n";
    
    echo "\n";
    echo "========================================\n";
    echo "Seeding completed successfully!\n";
    echo "Total competencies inserted: {$insertedCount}\n";
    echo "========================================\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
