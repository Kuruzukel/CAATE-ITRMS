<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../app/config/database.php';

/**
 * Add 10 Sample Trainee Accounts with Randomized Passwords
 */

function generateRandomPassword($length = 10) {
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    $password = '';
    $max = strlen($chars) - 1;
    for ($i = 0; $i < $length; $i++) {
        $password .= $chars[random_int(0, $max)];
    }
    return $password;
}

try {
    $db = getMongoConnection();
    
    echo "Adding 10 Sample Trainee Accounts...\n\n";
    
    $traineesCollection = $db->trainees;
    
    // Get the current highest trainee number
    $lastTrainee = $traineesCollection->findOne(
        [],
        ['sort' => ['trainee_id' => -1]]
    );
    
    $startNumber = 6; // Default starting number
    if ($lastTrainee && isset($lastTrainee['trainee_id'])) {
        preg_match('/TRN-2024-(\d+)/', $lastTrainee['trainee_id'], $matches);
        if (isset($matches[1])) {
            $startNumber = intval($matches[1]) + 1;
        }
    }
    
    $firstNames = ['Sophia', 'Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Charlotte', 'James'];
    $lastNames = ['Bautista', 'Villanueva', 'Fernandez', 'Lopez', 'Gonzales', 'Rivera', 'Martinez', 'Aquino', 'Castillo', 'Morales'];
    $genders = ['Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male'];
    $addresses = [
        '123 Quezon Ave, Quezon City',
        '456 Taft Ave, Manila',
        '789 EDSA, Mandaluyong',
        '321 Ortigas Ave, Pasig',
        '654 Shaw Blvd, Mandaluyong',
        '987 España Blvd, Manila',
        '147 Katipunan Ave, Quezon City',
        '258 Commonwealth Ave, Quezon City',
        '369 Marcos Highway, Marikina',
        '741 Aurora Blvd, Quezon City'
    ];
    
    $createdTrainees = [];
    
    for ($i = 0; $i < 10; $i++) {
        $traineeNumber = str_pad($startNumber + $i, 3, '0', STR_PAD_LEFT);
        $traineeId = "TRN-2024-{$traineeNumber}";
        
        // Check if trainee already exists
        $existing = $traineesCollection->findOne(['trainee_id' => $traineeId]);
        if ($existing) {
            echo "  ⚠ Trainee {$traineeId} already exists, skipping...\n";
            continue;
        }
        
        $firstName = $firstNames[$i];
        $lastName = $lastNames[$i];
        $email = strtolower($firstName . '.' . $lastName . '@example.com');
        $password = generateRandomPassword(12);
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        // Random birth year between 1995 and 2003
        $birthYear = rand(1995, 2003);
        $birthMonth = rand(1, 12);
        $birthDay = rand(1, 28);
        $birthDate = strtotime("{$birthYear}-{$birthMonth}-{$birthDay}");
        
        $trainee = [
            'trainee_id' => $traineeId,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email,
            'password' => $hashedPassword,
            'phone' => '0917' . str_pad(rand(1000000, 9999999), 7, '0', STR_PAD_LEFT),
            'address' => $addresses[$i],
            'date_of_birth' => new MongoDB\BSON\UTCDateTime($birthDate * 1000),
            'gender' => $genders[$i],
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ];
        
        $result = $traineesCollection->insertOne($trainee);
        
        $createdTrainees[] = [
            'trainee_id' => $traineeId,
            'name' => "{$firstName} {$lastName}",
            'email' => $email,
            'password' => $password
        ];
        
        echo "  ✓ Created trainee: {$firstName} {$lastName} ({$traineeId})\n";
    }
    
    echo "\n✅ Successfully created " . count($createdTrainees) . " trainee accounts!\n";
    echo "\n" . str_repeat("=", 80) . "\n";
    echo "TRAINEE ACCOUNT CREDENTIALS\n";
    echo str_repeat("=", 80) . "\n\n";
    
    foreach ($createdTrainees as $trainee) {
        echo "Trainee ID: {$trainee['trainee_id']}\n";
        echo "Name:       {$trainee['name']}\n";
        echo "Email:      {$trainee['email']}\n";
        echo "Password:   {$trainee['password']}\n";
        echo str_repeat("-", 80) . "\n";
    }
    
    echo "\nTotal Trainees in Database: " . $traineesCollection->countDocuments() . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
