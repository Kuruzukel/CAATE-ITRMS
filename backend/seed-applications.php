<?php
/**
 * Seed 8 sample application records with complete data
 */

require_once __DIR__ . '/app/config/database.php';

try {
    $db = getMongoConnection();
    
    echo "=== SEEDING APPLICATION RECORDS ===\n\n";
    echo "Current Date: " . date('Y-m-d H:i:s') . "\n\n";
    
    $now = new MongoDB\BSON\UTCDateTime();
    
    // Get applications collection
    $applicationCollection = $db->applications;
    
    // Get trainees collection to link user_id
    $traineeCollection = $db->trainees;
    
    // Fetch some trainees to link applications
    $trainees = $traineeCollection->find([], ['limit' => 8])->toArray();
    
    if (count($trainees) < 8) {
        echo "Warning: Less than 8 trainees found. Some applications will not have user_id.\n\n";
    }
    
    // Sample applications with complete data
    $applications = [
        [
            'user_id' => isset($trainees[0]) ? $trainees[0]->_id : null,
            'reference_number' => 'BC2024NCR01AC001000001',
            'uli' => '1234567890123456',
            'picture' => null,
            'signature' => null,
            'school_name' => 'CAATE Training Center',
            'assessment_title' => 'Beauty Care (Skin Care) NC II',
            'school_address' => '123 Main St, Manila, NCR',
            'application_date' => '2024-01-15',
            'assessment_type' => 'Competency Assessment',
            'client_type' => 'Individual',
            'name' => [
                'surname' => 'Dela Cruz',
                'first_name' => 'Maria',
                'second_name' => '',
                'middle_name' => 'Santos',
                'middle_initial' => 'S',
                'name_extension' => ''
            ],
            'mailing_address' => [
                'number_street' => '456 Rizal Avenue',
                'barangay' => 'Barangay 1',
                'district' => 'District 1',
                'city' => 'Manila',
                'province' => 'Metro Manila',
                'region' => 'NCR',
                'zip' => '1000'
            ],
            'mothers_name' => 'Rosa Santos',
            'fathers_name' => 'Juan Dela Cruz',
            'sex' => 'Female',
            'civil_status' => 'Single',
            'employment_status' => 'Employed',
            'birth_date' => '1995-03-20',
            'birth_place' => 'Manila, Philippines',
            'age' => 29,
            'education' => 'College Graduate',
            'parent_guardian_name' => 'Rosa Santos',
            'parent_guardian_address' => '456 Rizal Avenue, Manila',
            'contact' => [
                'tel' => '02-1234567',
                'mobile' => '09171234567',
                'fax' => '',
                'email' => 'maria.delacruz@email.com',
                'other_contact' => ''
            ],
            'work_experience' => [
                [
                    'company' => 'Beauty Salon Inc.',
                    'position' => 'Beauty Therapist',
                    'inclusive_dates' => '2018-2023',
                    'monthly_salary' => '15000',
                    'status_of_appointment' => 'Regular',
                    'years_of_experience' => 5
                ]
            ],
            'training_seminars' => [
                [
                    'title' => 'Advanced Skin Care Techniques',
                    'venue' => 'Manila Convention Center',
                    'inclusive_dates' => '2022-06-15 to 2022-06-17',
                    'number_of_hours' => 24,
                    'conducted_by' => 'Philippine Beauty Association'
                ]
            ],
            'licensure_exams' => [],
            'competency_assessments' => [],
            'status' => 'approved',
            'submitted_at' => '2024-01-15 10:30:00',
            'created_at' => $now,
            'updated_at' => $now
        ],
        [
            'user_id' => isset($trainees[1]) ? $trainees[1]->_id : null,
            'reference_number' => 'BN2024NCR01AC002000002',
            'uli' => '2345678901234567',
            'picture' => null,
            'signature' => null,
            'school_name' => 'CAATE Training Center',
            'assessment_title' => 'Beauty Care (Nail Care) NC II',
            'school_address' => '123 Main St, Manila, NCR',
            'application_date' => '2024-02-10',
            'assessment_type' => 'Competency Assessment',
            'client_type' => 'Individual',
            'name' => [
                'surname' => 'Reyes',
                'first_name' => 'Ana',
                'second_name' => 'Marie',
                'middle_name' => 'Lopez',
                'middle_initial' => 'L',
                'name_extension' => ''
            ],
            'mailing_address' => [
                'number_street' => '789 Quezon Boulevard',
                'barangay' => 'Barangay 5',
                'district' => 'District 2',
                'city' => 'Quezon City',
                'province' => 'Metro Manila',
                'region' => 'NCR',
                'zip' => '1100'
            ],
            'mothers_name' => 'Carmen Lopez',
            'fathers_name' => 'Roberto Reyes',
            'sex' => 'Female',
            'civil_status' => 'Married',
            'employment_status' => 'Self-Employed',
            'birth_date' => '1992-07-14',
            'birth_place' => 'Quezon City, Philippines',
            'age' => 32,
            'education' => 'High School Graduate',
            'parent_guardian_name' => 'Carmen Lopez',
            'parent_guardian_address' => '789 Quezon Boulevard, Quezon City',
            'contact' => [
                'tel' => '02-9876543',
                'mobile' => '09189876543',
                'fax' => '',
                'email' => 'ana.reyes@email.com',
                'other_contact' => ''
            ],
            'work_experience' => [
                [
                    'company' => 'Nail Art Studio',
                    'position' => 'Nail Technician',
                    'inclusive_dates' => '2015-2024',
                    'monthly_salary' => '18000',
                    'status_of_appointment' => 'Self-Employed',
                    'years_of_experience' => 9
                ]
            ],
            'training_seminars' => [
                [
                    'title' => 'Nail Art and Design Workshop',
                    'venue' => 'SM Megamall',
                    'inclusive_dates' => '2023-03-10 to 2023-03-12',
                    'number_of_hours' => 20,
                    'conducted_by' => 'Nail Artists Guild'
                ]
            ],
            'licensure_exams' => [],
            'competency_assessments' => [],
            'status' => 'pending',
            'submitted_at' => '2024-02-10 14:20:00',
            'created_at' => $now,
            'updated_at' => $now
        ],
        [
            'user_id' => isset($trainees[2]) ? $trainees[2]->_id : null,
            'reference_number' => 'TM2024NCR01AC003000003',
            'uli' => '3456789012345678',
            'picture' => null,
            'signature' => null,
            'school_name' => 'CAATE Training Center',
            'assessment_title' => 'Trainers Methodology Level I',
            'school_address' => '123 Main St, Manila, NCR',
            'application_date' => '2024-03-05',
            'assessment_type' => 'Competency Assessment',
            'client_type' => 'Individual',
            'name' => [
                'surname' => 'Garcia',
                'first_name' => 'Carlos',
                'second_name' => '',
                'middle_name' => 'Mendoza',
                'middle_initial' => 'M',
                'name_extension' => 'Jr.'
            ],
            'mailing_address' => [
                'number_street' => '321 Taft Avenue',
                'barangay' => 'Barangay 10',
                'district' => 'District 3',
                'city' => 'Pasay',
                'province' => 'Metro Manila',
                'region' => 'NCR',
                'zip' => '1300'
            ],
            'mothers_name' => 'Elena Mendoza',
            'fathers_name' => 'Carlos Garcia Sr.',
            'sex' => 'Male',
            'civil_status' => 'Single',
            'employment_status' => 'Employed',
            'birth_date' => '1990-11-25',
            'birth_place' => 'Pasay, Philippines',
            'age' => 34,
            'education' => 'College Graduate',
            'parent_guardian_name' => 'Elena Mendoza',
            'parent_guardian_address' => '321 Taft Avenue, Pasay',
            'contact' => [
                'tel' => '02-5551234',
                'mobile' => '09175551234',
                'fax' => '',
                'email' => 'carlos.garcia@email.com',
                'other_contact' => ''
            ],
            'work_experience' => [
                [
                    'company' => 'Technical Training Institute',
                    'position' => 'Training Coordinator',
                    'inclusive_dates' => '2016-2024',
                    'monthly_salary' => '25000',
                    'status_of_appointment' => 'Regular',
                    'years_of_experience' => 8
                ]
            ],
            'training_seminars' => [
                [
                    'title' => 'Effective Training Delivery',
                    'venue' => 'TESDA Main Office',
                    'inclusive_dates' => '2023-08-20 to 2023-08-25',
                    'number_of_hours' => 40,
                    'conducted_by' => 'TESDA'
                ]
            ],
            'licensure_exams' => [],
            'competency_assessments' => [],
            'status' => 'approved',
            'submitted_at' => '2024-03-05 09:15:00',
            'created_at' => $now,
            'updated_at' => $now
        ],
        [
            'user_id' => isset($trainees[3]) ? $trainees[3]->_id : null,
            'reference_number' => 'EE2024NCR01AC004000004',
            'uli' => '4567890123456789',
            'picture' => null,
            'signature' => null,
            'school_name' => 'CAATE Training Center',
            'assessment_title' => 'Eyelash & Eyebrow Services Level III',
            'school_address' => '123 Main St, Manila, NCR',
            'application_date' => '2024-04-12',
            'assessment_type' => 'Competency Assessment',
            'client_type' => 'Individual',
            'name' => [
                'surname' => 'Santos',
                'first_name' => 'Isabella',
                'second_name' => 'Grace',
                'middle_name' => 'Torres',
                'middle_initial' => 'T',
                'name_extension' => ''
            ],
            'mailing_address' => [
                'number_street' => '555 Ortigas Avenue',
                'barangay' => 'Barangay 15',
                'district' => 'District 4',
                'city' => 'Pasig',
                'province' => 'Metro Manila',
                'region' => 'NCR',
                'zip' => '1600'
            ],
            'mothers_name' => 'Gloria Torres',
            'fathers_name' => 'Miguel Santos',
            'sex' => 'Female',
            'civil_status' => 'Single',
            'employment_status' => 'Self-Employed',
            'birth_date' => '1998-05-08',
            'birth_place' => 'Pasig, Philippines',
            'age' => 26,
            'education' => 'Vocational Graduate',
            'parent_guardian_name' => 'Gloria Torres',
            'parent_guardian_address' => '555 Ortigas Avenue, Pasig',
            'contact' => [
                'tel' => '02-6667890',
                'mobile' => '09186667890',
                'fax' => '',
                'email' => 'isabella.santos@email.com',
                'other_contact' => ''
            ],
            'work_experience' => [
                [
                    'company' => 'Lash & Brow Studio',
                    'position' => 'Lash Artist',
                    'inclusive_dates' => '2020-2024',
                    'monthly_salary' => '20000',
                    'status_of_appointment' => 'Self-Employed',
                    'years_of_experience' => 4
                ]
            ],
            'training_seminars' => [
                [
                    'title' => 'Advanced Eyelash Extension Techniques',
                    'venue' => 'Beauty Academy Manila',
                    'inclusive_dates' => '2023-05-15 to 2023-05-18',
                    'number_of_hours' => 32,
                    'conducted_by' => 'International Lash Association'
                ]
            ],
            'licensure_exams' => [],
            'competency_assessments' => [],
            'status' => 'pending',
            'submitted_at' => '2024-04-12 11:45:00',
            'created_at' => $now,
            'updated_at' => $now
        ],
        [
            'user_id' => isset($trainees[4]) ? $trainees[4]->_id : null,
            'reference_number' => 'AS2024NCR01AC005000005',
            'uli' => '5678901234567890',
            'picture' => null,
            'signature' => null,
            'school_name' => 'CAATE Training Center',
            'assessment_title' => 'Aesthetic Services Level II',
            'school_address' => '123 Main St, Manila, NCR',
            'application_date' => '2024-05-20',
            'assessment_type' => 'Competency Assessment',
            'client_type' => 'Individual',
            'name' => [
                'surname' => 'Villanueva',
                'first_name' => 'Sofia',
                'second_name' => '',
                'middle_name' => 'Ramos',
                'middle_initial' => 'R',
                'name_extension' => ''
            ],
            'mailing_address' => [
                'number_street' => '888 Shaw Boulevard',
                'barangay' => 'Barangay 20',
                'district' => 'District 5',
                'city' => 'Mandaluyong',
                'province' => 'Metro Manila',
                'region' => 'NCR',
                'zip' => '1550'
            ],
            'mothers_name' => 'Patricia Ramos',
            'fathers_name' => 'Antonio Villanueva',
            'sex' => 'Female',
            'civil_status' => 'Married',
            'employment_status' => 'Employed',
            'birth_date' => '1993-09-30',
            'birth_place' => 'Mandaluyong, Philippines',
            'age' => 31,
            'education' => 'College Graduate',
            'parent_guardian_name' => 'Patricia Ramos',
            'parent_guardian_address' => '888 Shaw Boulevard, Mandaluyong',
            'contact' => [
                'tel' => '02-7778901',
                'mobile' => '09177778901',
                'fax' => '',
                'email' => 'sofia.villanueva@email.com',
                'other_contact' => ''
            ],
            'work_experience' => [
                [
                    'company' => 'Aesthetic Clinic Manila',
                    'position' => 'Aesthetic Specialist',
                    'inclusive_dates' => '2017-2024',
                    'monthly_salary' => '30000',
                    'status_of_appointment' => 'Regular',
                    'years_of_experience' => 7
                ]
            ],
            'training_seminars' => [
                [
                    'title' => 'Non-Invasive Aesthetic Procedures',
                    'venue' => 'Medical Plaza Makati',
                    'inclusive_dates' => '2023-09-10 to 2023-09-15',
                    'number_of_hours' => 48,
                    'conducted_by' => 'Philippine Association of Aesthetic Medicine'
                ]
            ],
            'licensure_exams' => [],
            'competency_assessments' => [],
            'status' => 'approved',
            'submitted_at' => '2024-05-20 13:30:00',
            'created_at' => $now,
            'updated_at' => $now
        ],
        [
            'user_id' => isset($trainees[5]) ? $trainees[5]->_id : null,
            'reference_number' => 'AS2024NCR01AC006000006',
            'uli' => '6789012345678901',
            'picture' => null,
            'signature' => null,
            'school_name' => 'CAATE Training Center',
            'assessment_title' => 'Aesthetic Services Level III',
            'school_address' => '123 Main St, Manila, NCR',
            'application_date' => '2024-06-18',
            'assessment_type' => 'Competency Assessment',
            'client_type' => 'Individual',
            'name' => [
                'surname' => 'Fernandez',
                'first_name' => 'Miguel',
                'second_name' => 'Angelo',
                'middle_name' => 'Cruz',
                'middle_initial' => 'C',
                'name_extension' => ''
            ],
            'mailing_address' => [
                'number_street' => '999 EDSA',
                'barangay' => 'Barangay 25',
                'district' => 'District 6',
                'city' => 'Makati',
                'province' => 'Metro Manila',
                'region' => 'NCR',
                'zip' => '1200'
            ],
            'mothers_name' => 'Angelica Cruz',
            'fathers_name' => 'Fernando Fernandez',
            'sex' => 'Male',
            'civil_status' => 'Single',
            'employment_status' => 'Employed',
            'birth_date' => '1994-12-12',
            'birth_place' => 'Makati, Philippines',
            'age' => 30,
            'education' => 'College Graduate',
            'parent_guardian_name' => 'Angelica Cruz',
            'parent_guardian_address' => '999 EDSA, Makati',
            'contact' => [
                'tel' => '02-8889012',
                'mobile' => '09188889012',
                'fax' => '',
                'email' => 'miguel.fernandez@email.com',
                'other_contact' => ''
            ],
            'work_experience' => [
                [
                    'company' => 'Premium Aesthetic Center',
                    'position' => 'Senior Aesthetic Therapist',
                    'inclusive_dates' => '2018-2024',
                    'monthly_salary' => '35000',
                    'status_of_appointment' => 'Regular',
                    'years_of_experience' => 6
                ]
            ],
            'training_seminars' => [
                [
                    'title' => 'Advanced Aesthetic Technologies',
                    'venue' => 'Shangri-La Hotel Manila',
                    'inclusive_dates' => '2023-11-05 to 2023-11-10',
                    'number_of_hours' => 50,
                    'conducted_by' => 'International Aesthetic Association'
                ]
            ],
            'licensure_exams' => [],
            'competency_assessments' => [],
            'status' => 'cancelled',
            'submitted_at' => '2024-06-18 15:00:00',
            'created_at' => $now,
            'updated_at' => $now
        ],
        [
            'user_id' => isset($trainees[6]) ? $trainees[6]->_id : null,
            'reference_number' => 'AS2024NCR01AC007000007',
            'uli' => '7890123456789012',
            'picture' => null,
            'signature' => null,
            'school_name' => 'CAATE Training Center',
            'assessment_title' => 'Advanced Skin Care Level IV',
            'school_address' => '123 Main St, Manila, NCR',
            'application_date' => '2024-07-22',
            'assessment_type' => 'Competency Assessment',
            'client_type' => 'Individual',
            'name' => [
                'surname' => 'Martinez',
                'first_name' => 'Elena',
                'second_name' => 'Rose',
                'middle_name' => 'Perez',
                'middle_initial' => 'P',
                'name_extension' => ''
            ],
            'mailing_address' => [
                'number_street' => '111 Commonwealth Avenue',
                'barangay' => 'Barangay 30',
                'district' => 'District 7',
                'city' => 'Quezon City',
                'province' => 'Metro Manila',
                'region' => 'NCR',
                'zip' => '1121'
            ],
            'mothers_name' => 'Rosario Perez',
            'fathers_name' => 'Eduardo Martinez',
            'sex' => 'Female',
            'civil_status' => 'Married',
            'employment_status' => 'Self-Employed',
            'birth_date' => '1991-04-18',
            'birth_place' => 'Quezon City, Philippines',
            'age' => 33,
            'education' => 'College Graduate',
            'parent_guardian_name' => 'Rosario Perez',
            'parent_guardian_address' => '111 Commonwealth Avenue, Quezon City',
            'contact' => [
                'tel' => '02-9990123',
                'mobile' => '09179990123',
                'fax' => '',
                'email' => 'elena.martinez@email.com',
                'other_contact' => ''
            ],
            'work_experience' => [
                [
                    'company' => 'Elite Skin Care Clinic',
                    'position' => 'Senior Dermatology Therapist',
                    'inclusive_dates' => '2015-2024',
                    'monthly_salary' => '40000',
                    'status_of_appointment' => 'Self-Employed',
                    'years_of_experience' => 9
                ]
            ],
            'training_seminars' => [
                [
                    'title' => 'Advanced Dermatological Treatments',
                    'venue' => 'Philippine General Hospital',
                    'inclusive_dates' => '2023-12-01 to 2023-12-08',
                    'number_of_hours' => 60,
                    'conducted_by' => 'Philippine Dermatological Society'
                ]
            ],
            'licensure_exams' => [],
            'competency_assessments' => [],
            'status' => 'pending',
            'submitted_at' => '2024-07-22 10:00:00',
            'created_at' => $now,
            'updated_at' => $now
        ],
        [
            'user_id' => isset($trainees[7]) ? $trainees[7]->_id : null,
            'reference_number' => 'PM2024NCR01AC008000008',
            'uli' => '8901234567890123',
            'picture' => null,
            'signature' => null,
            'school_name' => 'CAATE Training Center',
            'assessment_title' => 'Permanent Makeup Tattoo Level III',
            'school_address' => '123 Main St, Manila, NCR',
            'application_date' => '2024-08-15',
            'assessment_type' => 'Competency Assessment',
            'client_type' => 'Individual',
            'name' => [
                'surname' => 'Aquino',
                'first_name' => 'Rafael',
                'second_name' => 'Luis',
                'middle_name' => 'Diaz',
                'middle_initial' => 'D',
                'name_extension' => ''
            ],
            'mailing_address' => [
                'number_street' => '222 Roxas Boulevard',
                'barangay' => 'Barangay 35',
                'district' => 'District 8',
                'city' => 'Paranaque',
                'province' => 'Metro Manila',
                'region' => 'NCR',
                'zip' => '1700'
            ],
            'mothers_name' => 'Luisa Diaz',
            'fathers_name' => 'Ramon Aquino',
            'sex' => 'Male',
            'civil_status' => 'Single',
            'employment_status' => 'Self-Employed',
            'birth_date' => '1996-08-22',
            'birth_place' => 'Paranaque, Philippines',
            'age' => 28,
            'education' => 'Vocational Graduate',
            'parent_guardian_name' => 'Luisa Diaz',
            'parent_guardian_address' => '222 Roxas Boulevard, Paranaque',
            'contact' => [
                'tel' => '02-1110234',
                'mobile' => '09181110234',
                'fax' => '',
                'email' => 'rafael.aquino@email.com',
                'other_contact' => ''
            ],
            'work_experience' => [
                [
                    'company' => 'Permanent Makeup Studio',
                    'position' => 'Permanent Makeup Artist',
                    'inclusive_dates' => '2019-2024',
                    'monthly_salary' => '28000',
                    'status_of_appointment' => 'Self-Employed',
                    'years_of_experience' => 5
                ]
            ],
            'training_seminars' => [
                [
                    'title' => 'Microblading and Permanent Makeup Certification',
                    'venue' => 'Beauty Institute Philippines',
                    'inclusive_dates' => '2024-01-10 to 2024-01-20',
                    'number_of_hours' => 80,
                    'conducted_by' => 'International Permanent Makeup Association'
                ]
            ],
            'licensure_exams' => [],
            'competency_assessments' => [],
            'status' => 'approved',
            'submitted_at' => '2024-08-15 16:20:00',
            'created_at' => $now,
            'updated_at' => $now
        ]
    ];
    
    echo "Creating 8 sample applications...\n\n";
    
    foreach ($applications as $index => $application) {
        $result = $applicationCollection->insertOne($application);
        $fullName = $application['name']['first_name'] . ' ' . $application['name']['surname'];
        echo "  ✓ Created application #" . ($index + 1) . ": {$fullName} - {$application['assessment_title']} (Status: {$application['status']})\n";
    }
    
    echo "\n=== COMPLETED ===\n";
    echo "Added 8 sample application records with complete data!\n";
    echo "Refresh your application page to see the new records.\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
