<?php

require_once __DIR__ . '/../config/database.php';

class Trainee {
    private $collection;
    
    public function __construct() {
        $db = getMongoConnection();
        $this->collection = $db->trainees;
    }
    
    public function findByEmail($email) {
        $document = $this->collection->findOne(['email' => $email]);
        if ($document) {
            $trainee = (array)$document;
            // Convert MongoDB ObjectId to string
            if (isset($trainee['_id'])) {
                $trainee['_id'] = (string)$trainee['_id'];
            }
            return $trainee;
        }
        return null;
    }
    
    public function findByUsername($username) {
        $document = $this->collection->findOne(['username' => $username]);
        if ($document) {
            $trainee = (array)$document;
            // Convert MongoDB ObjectId to string
            if (isset($trainee['_id'])) {
                $trainee['_id'] = (string)$trainee['_id'];
            }
            return $trainee;
        }
        return null;
    }
    
    public function findByEmailOrUsername($identifier) {
        $document = $this->collection->findOne([
            '$or' => [
                ['email' => $identifier],
                ['username' => $identifier]
            ]
        ]);
        if ($document) {
            $trainee = (array)$document;
            // Convert MongoDB ObjectId to string
            if (isset($trainee['_id'])) {
                $trainee['_id'] = (string)$trainee['_id'];
            }
            return $trainee;
        }
        return null;
    }
    
    public function findById($id) {
        try {
            $document = $this->collection->findOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
            if ($document) {
                $trainee = (array)$document;
                // Convert MongoDB ObjectId to string
                if (isset($trainee['_id'])) {
                    $trainee['_id'] = (string)$trainee['_id'];
                }
                return $trainee;
            }
            return null;
        } catch (Exception $e) {
            error_log("Trainee::findById - Exception: " . $e->getMessage());
            error_log("Trainee::findById - Stack trace: " . $e->getTraceAsString());
            return null;
        }
    }
    
    public function all() {
        try {
            $cursor = $this->collection->find();
            $trainees = [];
            foreach ($cursor as $document) {
                $trainee = (array)$document;
                // Convert MongoDB ObjectId to string
                if (isset($trainee['_id'])) {
                    $trainee['_id'] = (string)$trainee['_id'];
                }
                $trainees[] = $trainee;
            }
            return $trainees;
        } catch (Exception $e) {
            error_log("Error fetching all trainees: " . $e->getMessage());
            return [];
        }
    }
    
    public function create($data) {
        try {
            // Generate trainee_id if not provided or empty
            if (empty($data['trainee_id'])) {
                $data['trainee_id'] = $this->generateTraineeId();
            }
            
            // Don't hash password - store as plain text
            // Password is already in plain text from the form
            
            // Add timestamps
            $data['created_at'] = new MongoDB\BSON\UTCDateTime();
            $data['updated_at'] = new MongoDB\BSON\UTCDateTime();
            
            $result = $this->collection->insertOne($data);
            return (string)$result->getInsertedId();
        } catch (Exception $e) {
            error_log("Error creating trainee: " . $e->getMessage());
            throw $e;
        }
    }
    
    private function generateTraineeId() {
        // Get current year
        $year = date('Y');
        
        // Find the last trainee ID for this year
        $lastTrainee = $this->collection->findOne(
            ['trainee_id' => ['$regex' => "^TRN-$year-"]],
            ['sort' => ['trainee_id' => -1]]
        );
        
        if ($lastTrainee && isset($lastTrainee['trainee_id'])) {
            // Extract the number from the last ID (e.g., "TRN-2026-005" -> 5)
            $lastId = $lastTrainee['trainee_id'];
            $parts = explode('-', $lastId);
            $lastNumber = isset($parts[2]) ? (int)$parts[2] : 0;
            $newNumber = $lastNumber + 1;
        } else {
            // First trainee for this year
            $newNumber = 1;
        }
        
        // Format: TRN-YYYY-NNN (e.g., TRN-2026-001)
        return sprintf('TRN-%d-%03d', $year, $newNumber);
    }
    
    public function update($id, $data) {
        try {
            // Remove password from update if empty
            if (isset($data['password']) && empty($data['password'])) {
                unset($data['password']);
            }
            // Don't hash password - store as plain text
            
            // Update timestamp
            $data['updated_at'] = new MongoDB\BSON\UTCDateTime();
            
            $result = $this->collection->updateOne(
                ['_id' => new MongoDB\BSON\ObjectId($id)],
                ['$set' => $data]
            );
            
            return $result->getModifiedCount() > 0 || $result->getMatchedCount() > 0;
        } catch (Exception $e) {
            error_log("Error updating trainee: " . $e->getMessage());
            return false;
        }
    }
    
    public function delete($id) {
        try {
            $result = $this->collection->deleteOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
            return $result->getDeletedCount() > 0;
        } catch (Exception $e) {
            error_log("Error deleting trainee: " . $e->getMessage());
            return false;
        }
    }
    
    public function getStatistics() {
        try {
            $year = isset($_GET['year']) ? (int)$_GET['year'] : date('Y');
            $db = getMongoConnection();
            
            // Total trainees - count all trainees in the collection
            $totalTrainees = 0;
            $activeTrainees = 0;
            $graduates = 0;
            
            try {
                $totalTrainees = $this->collection->countDocuments();
                $activeTrainees = $this->collection->countDocuments(['status' => 'active']);
                $graduates = $this->collection->countDocuments(['status' => 'graduated']);
            } catch (Exception $e) {
                error_log("Error counting trainees: " . $e->getMessage());
            }
            
            // Get enrollment data from registrations, applications, and admissions collections
            $registrationCollection = $db->registrations;
            $applicationCollection = $db->applications;
            $admissionCollection = $db->admissions;
            
            // Count total enrollments from all three collections
            $totalRegistrations = $registrationCollection->countDocuments();
            $totalApplications = $applicationCollection->countDocuments();
            $totalAdmissions = $admissionCollection->countDocuments();
            
            // Calculate today's enrollments (from all three collections)
            $todayStart = new MongoDB\BSON\UTCDateTime(strtotime('today') * 1000);
            $todayEnd = new MongoDB\BSON\UTCDateTime(strtotime('tomorrow') * 1000);
            
            $todayRegistrations = $registrationCollection->countDocuments([
                'created_at' => ['$gte' => $todayStart, '$lt' => $todayEnd]
            ]);
            $todayApplications = $applicationCollection->countDocuments([
                'created_at' => ['$gte' => $todayStart, '$lt' => $todayEnd]
            ]);
            $todayAdmissions = $admissionCollection->countDocuments([
                'created_at' => ['$gte' => $todayStart, '$lt' => $todayEnd]
            ]);
            $todayEnrollments = $todayRegistrations + $todayApplications + $todayAdmissions;
            
            // Calculate yesterday's enrollments for percentage comparison
            $yesterdayStart = new MongoDB\BSON\UTCDateTime(strtotime('yesterday') * 1000);
            $yesterdayEnd = new MongoDB\BSON\UTCDateTime(strtotime('today') * 1000);
            
            $yesterdayRegistrations = $registrationCollection->countDocuments([
                'created_at' => ['$gte' => $yesterdayStart, '$lt' => $yesterdayEnd]
            ]);
            $yesterdayApplications = $applicationCollection->countDocuments([
                'created_at' => ['$gte' => $yesterdayStart, '$lt' => $yesterdayEnd]
            ]);
            $yesterdayAdmissions = $admissionCollection->countDocuments([
                'created_at' => ['$gte' => $yesterdayStart, '$lt' => $yesterdayEnd]
            ]);
            $yesterdayEnrollments = $yesterdayRegistrations + $yesterdayApplications + $yesterdayAdmissions;
            
            // Calculate percentage increase
            $todayPercentageIncrease = 0;
            if ($yesterdayEnrollments > 0) {
                $todayPercentageIncrease = round((($todayEnrollments - $yesterdayEnrollments) / $yesterdayEnrollments) * 100, 1);
            } elseif ($todayEnrollments > 0) {
                $todayPercentageIncrease = 100;
            }
            
            // Count approved enrollments (status = 'approved' or 'enrolled')
            $approvedRegistrations = $registrationCollection->countDocuments([
                'status' => ['$in' => ['approved', 'enrolled']]
            ]);
            $approvedApplications = $applicationCollection->countDocuments([
                'status' => ['$in' => ['approved', 'enrolled']]
            ]);
            $approvedAdmissions = $admissionCollection->countDocuments([
                'status' => ['$in' => ['approved', 'enrolled']]
            ]);
            $approvedEnrollments = $approvedRegistrations + $approvedApplications + $approvedAdmissions;
            
            // Count pending enrollments
            $pendingRegistrations = $registrationCollection->countDocuments(['status' => 'pending']);
            $pendingApplications = $applicationCollection->countDocuments(['status' => 'pending']);
            $pendingAdmissions = $admissionCollection->countDocuments(['status' => 'pending']);
            $pendingEnrollments = $pendingRegistrations + $pendingApplications + $pendingAdmissions;
            
            // Count cancelled enrollments
            $cancelledRegistrations = $registrationCollection->countDocuments([
                'status' => ['$in' => ['cancelled', 'rejected']]
            ]);
            $cancelledApplications = $applicationCollection->countDocuments([
                'status' => ['$in' => ['cancelled', 'rejected']]
            ]);
            $cancelledAdmissions = $admissionCollection->countDocuments([
                'status' => ['$in' => ['cancelled', 'rejected']]
            ]);
            $cancelledEnrollments = $cancelledRegistrations + $cancelledApplications + $cancelledAdmissions;
            
            // Calculate this month's enrollments
            $monthStart = new MongoDB\BSON\UTCDateTime(strtotime('first day of this month') * 1000);
            $monthEnd = new MongoDB\BSON\UTCDateTime(strtotime('first day of next month') * 1000);
            
            $monthRegistrations = $registrationCollection->countDocuments([
                'created_at' => ['$gte' => $monthStart, '$lt' => $monthEnd]
            ]);
            $monthApplications = $applicationCollection->countDocuments([
                'created_at' => ['$gte' => $monthStart, '$lt' => $monthEnd]
            ]);
            $monthAdmissions = $admissionCollection->countDocuments([
                'created_at' => ['$gte' => $monthStart, '$lt' => $monthEnd]
            ]);
            $monthEnrollments = $monthRegistrations + $monthApplications + $monthAdmissions;
            
            // Calculate last month's enrollments for percentage comparison
            $lastMonthStart = new MongoDB\BSON\UTCDateTime(strtotime('first day of last month') * 1000);
            $lastMonthEnd = new MongoDB\BSON\UTCDateTime(strtotime('first day of this month') * 1000);
            
            $lastMonthRegistrations = $registrationCollection->countDocuments([
                'created_at' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]
            ]);
            $lastMonthApplications = $applicationCollection->countDocuments([
                'created_at' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]
            ]);
            $lastMonthAdmissions = $admissionCollection->countDocuments([
                'created_at' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]
            ]);
            $lastMonthEnrollments = $lastMonthRegistrations + $lastMonthApplications + $lastMonthAdmissions;
            
            // Calculate month percentage increase
            $monthPercentageIncrease = 0;
            if ($lastMonthEnrollments > 0) {
                $monthPercentageIncrease = round((($monthEnrollments - $lastMonthEnrollments) / $lastMonthEnrollments) * 100, 1);
            } elseif ($monthEnrollments > 0) {
                $monthPercentageIncrease = 100;
            }
            
            // Calculate current year and previous year enrollments
            $yearStart = new MongoDB\BSON\UTCDateTime(strtotime("$year-01-01") * 1000);
            $yearEnd = new MongoDB\BSON\UTCDateTime(strtotime(($year + 1) . "-01-01") * 1000);
            
            $currentYearRegistrations = $registrationCollection->countDocuments([
                'created_at' => ['$gte' => $yearStart, '$lt' => $yearEnd]
            ]);
            $currentYearApplications = $applicationCollection->countDocuments([
                'created_at' => ['$gte' => $yearStart, '$lt' => $yearEnd]
            ]);
            $currentYearAdmissions = $admissionCollection->countDocuments([
                'created_at' => ['$gte' => $yearStart, '$lt' => $yearEnd]
            ]);
            $currentYearEnrollments = $currentYearRegistrations + $currentYearApplications + $currentYearAdmissions;
            
            // Previous year enrollments
            $prevYearStart = new MongoDB\BSON\UTCDateTime(strtotime(($year - 1) . "-01-01") * 1000);
            $prevYearEnd = new MongoDB\BSON\UTCDateTime(strtotime("$year-01-01") * 1000);
            
            $prevYearRegistrations = $registrationCollection->countDocuments([
                'created_at' => ['$gte' => $prevYearStart, '$lt' => $prevYearEnd]
            ]);
            $prevYearApplications = $applicationCollection->countDocuments([
                'created_at' => ['$gte' => $prevYearStart, '$lt' => $prevYearEnd]
            ]);
            $prevYearAdmissions = $admissionCollection->countDocuments([
                'created_at' => ['$gte' => $prevYearStart, '$lt' => $prevYearEnd]
            ]);
            $previousYearEnrollments = $prevYearRegistrations + $prevYearApplications + $prevYearAdmissions;
            
            // Calculate year growth percentage
            $yearGrowthPercentage = 0;
            if ($previousYearEnrollments > 0) {
                $yearGrowthPercentage = round((($currentYearEnrollments - $previousYearEnrollments) / $previousYearEnrollments) * 100, 1);
            } elseif ($currentYearEnrollments > 0) {
                $yearGrowthPercentage = 100;
            }
            
            // Monthly enrollments for the year
            $monthlyEnrollments = array_fill(0, 12, 0);
            for ($month = 1; $month <= 12; $month++) {
                $monthStartDate = new MongoDB\BSON\UTCDateTime(strtotime("$year-$month-01") * 1000);
                $monthEndDate = new MongoDB\BSON\UTCDateTime(strtotime("$year-" . ($month + 1) . "-01") * 1000);
                
                $monthRegs = $registrationCollection->countDocuments([
                    'created_at' => ['$gte' => $monthStartDate, '$lt' => $monthEndDate]
                ]);
                $monthApps = $applicationCollection->countDocuments([
                    'created_at' => ['$gte' => $monthStartDate, '$lt' => $monthEndDate]
                ]);
                $monthAdms = $admissionCollection->countDocuments([
                    'created_at' => ['$gte' => $monthStartDate, '$lt' => $monthEndDate]
                ]);
                
                $monthlyEnrollments[$month - 1] = $monthRegs + $monthApps + $monthAdms;
            }
            
            // Log statistics for debugging
            error_log("Statistics - Total Trainees: $totalTrainees, Registrations: $totalRegistrations, Applications: $totalApplications, Admissions: $totalAdmissions");
            error_log("Today's Enrollments: $todayEnrollments, Approved: $approvedEnrollments, Pending: $pendingEnrollments, Cancelled: $cancelledEnrollments");
            
            return [
                'total' => $totalTrainees,
                'totalEnrollment' => $totalRegistrations + $totalApplications + $totalAdmissions,
                'totalRegistrations' => $totalRegistrations,
                'totalApplications' => $totalApplications,
                'totalAdmissions' => $totalAdmissions,
                'todayEnrollments' => $todayEnrollments,
                'todayPercentageIncrease' => $todayPercentageIncrease,
                'approvedEnrollments' => $approvedEnrollments,
                'pendingEnrollments' => $pendingEnrollments,
                'cancelledEnrollments' => $cancelledEnrollments,
                'monthEnrollments' => $monthEnrollments,
                'monthPercentageIncrease' => $monthPercentageIncrease,
                'currentYearEnrollments' => $currentYearEnrollments,
                'previousYearEnrollments' => $previousYearEnrollments,
                'yearGrowthPercentage' => $yearGrowthPercentage,
                'active_trainees' => $activeTrainees,
                'graduates' => $graduates,
                'monthly_enrollments' => $monthlyEnrollments,
                'year' => $year
            ];
        } catch (Exception $e) {
            error_log("Error getting statistics: " . $e->getMessage());
            error_log("Error getting statistics - Stack trace: " . $e->getTraceAsString());
            return [
                'total' => 0,
                'totalEnrollment' => 0,
                'totalRegistrations' => 0,
                'totalApplications' => 0,
                'totalAdmissions' => 0,
                'todayEnrollments' => 0,
                'todayPercentageIncrease' => 0,
                'approvedEnrollments' => 0,
                'pendingEnrollments' => 0,
                'cancelledEnrollments' => 0,
                'monthEnrollments' => 0,
                'monthPercentageIncrease' => 0,
                'currentYearEnrollments' => 0,
                'previousYearEnrollments' => 0,
                'yearGrowthPercentage' => 0,
                'active_trainees' => 0,
                'graduates' => 0,
                'monthly_enrollments' => array_fill(0, 12, 0),
                'year' => date('Y')
            ];
        }
    }
    

    
}
