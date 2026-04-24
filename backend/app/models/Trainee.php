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
            if (isset($trainee['_id'])) {
                $trainee['_id'] = (string)$trainee['_id'];
            }
            return $trainee;
        }
        return null;
    }
    
    public function findById($id) {
        try {
            // Try to find by MongoDB ObjectId first
            if (preg_match('/^[a-f0-9]{24}$/i', $id)) {
                $document = $this->collection->findOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
                if ($document) {
                    $trainee = (array)$document;
                    if (isset($trainee['_id'])) {
                        $trainee['_id'] = (string)$trainee['_id'];
                    }
                    return $trainee;
                }
            }
            
            // If not found or not a valid ObjectId, try finding by trainee_id field
            $document = $this->collection->findOne(['trainee_id' => $id]);
            if ($document) {
                $trainee = (array)$document;
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
            if (empty($data['trainee_id'])) {
                $data['trainee_id'] = $this->generateTraineeId();
            }
            
            
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
        $year = date('Y');
        
        $lastTrainee = $this->collection->findOne(
            ['trainee_id' => ['$regex' => "^TRN-$year-"]],
            ['sort' => ['trainee_id' => -1]]
        );
        
        if ($lastTrainee && isset($lastTrainee['trainee_id'])) {
            $lastId = $lastTrainee['trainee_id'];
            $parts = explode('-', $lastId);
            $lastNumber = isset($parts[2]) ? (int)$parts[2] : 0;
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }
        
        return sprintf('TRN-%d-%03d', $year, $newNumber);
    }
    
    public function update($id, $data) {
        try {
            if (isset($data['password']) && empty($data['password'])) {
                unset($data['password']);
            }
            
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
            
            $registrationCollection = $db->registrations;
            $applicationCollection = $db->applications;
            
            $totalRegistrations = $registrationCollection->countDocuments();
            $totalApplications = $applicationCollection->countDocuments();
            
            $todayStart = new MongoDB\BSON\UTCDateTime(strtotime('today') * 1000);
            $todayEnd = new MongoDB\BSON\UTCDateTime(strtotime('tomorrow') * 1000);
            
            $todayRegistrations = $registrationCollection->countDocuments([
                '$or' => [
                    ['created_at' => ['$gte' => $todayStart, '$lt' => $todayEnd]],
                    ['createdAt' => ['$gte' => $todayStart, '$lt' => $todayEnd]],
                    ['submittedAt' => ['$gte' => $todayStart, '$lt' => $todayEnd]]
                ]
            ]);
            $todayApplications = $applicationCollection->countDocuments([
                '$or' => [
                    ['created_at' => ['$gte' => $todayStart, '$lt' => $todayEnd]],
                    ['createdAt' => ['$gte' => $todayStart, '$lt' => $todayEnd]],
                    ['submittedAt' => ['$gte' => $todayStart, '$lt' => $todayEnd]]
                ]
            ]);
            $todayEnrollments = $todayRegistrations + $todayApplications;
            
            $yesterdayStart = new MongoDB\BSON\UTCDateTime(strtotime('yesterday') * 1000);
            $yesterdayEnd = new MongoDB\BSON\UTCDateTime(strtotime('today') * 1000);
            
            $yesterdayRegistrations = $registrationCollection->countDocuments([
                '$or' => [
                    ['created_at' => ['$gte' => $yesterdayStart, '$lt' => $yesterdayEnd]],
                    ['createdAt' => ['$gte' => $yesterdayStart, '$lt' => $yesterdayEnd]],
                    ['submittedAt' => ['$gte' => $yesterdayStart, '$lt' => $yesterdayEnd]]
                ]
            ]);
            $yesterdayApplications = $applicationCollection->countDocuments([
                '$or' => [
                    ['created_at' => ['$gte' => $yesterdayStart, '$lt' => $yesterdayEnd]],
                    ['createdAt' => ['$gte' => $yesterdayStart, '$lt' => $yesterdayEnd]],
                    ['submittedAt' => ['$gte' => $yesterdayStart, '$lt' => $yesterdayEnd]]
                ]
            ]);
            $yesterdayEnrollments = $yesterdayRegistrations + $yesterdayApplications;
            
            $todayPercentageIncrease = 0;
            if ($yesterdayEnrollments > 0) {
                $todayPercentageIncrease = round((($todayEnrollments - $yesterdayEnrollments) / $yesterdayEnrollments) * 100, 1);
            } elseif ($todayEnrollments > 0) {
                $todayPercentageIncrease = 100;
            }
            
            $approvedRegistrations = $registrationCollection->countDocuments([
                'status' => ['$in' => ['approved', 'enrolled']]
            ]);
            $approvedApplications = $applicationCollection->countDocuments([
                'status' => ['$in' => ['approved', 'enrolled']]
            ]);
            $approvedEnrollments = $approvedRegistrations + $approvedApplications;
            
            $pendingRegistrations = $registrationCollection->countDocuments(['status' => 'pending']);
            $pendingApplications = $applicationCollection->countDocuments(['status' => 'pending']);
            $pendingEnrollments = $pendingRegistrations + $pendingApplications;
            
            $cancelledRegistrations = $registrationCollection->countDocuments([
                'status' => ['$in' => ['cancelled', 'rejected']]
            ]);
            $cancelledApplications = $applicationCollection->countDocuments([
                'status' => ['$in' => ['cancelled', 'rejected']]
            ]);
            $cancelledEnrollments = $cancelledRegistrations + $cancelledApplications;
            
            $monthStart = new MongoDB\BSON\UTCDateTime(strtotime('first day of this month') * 1000);
            $monthEnd = new MongoDB\BSON\UTCDateTime(strtotime('first day of next month') * 1000);
            
            $monthRegistrations = $registrationCollection->countDocuments([
                '$or' => [
                    ['created_at' => ['$gte' => $monthStart, '$lt' => $monthEnd]],
                    ['createdAt' => ['$gte' => $monthStart, '$lt' => $monthEnd]],
                    ['submittedAt' => ['$gte' => $monthStart, '$lt' => $monthEnd]]
                ]
            ]);
            $monthApplications = $applicationCollection->countDocuments([
                '$or' => [
                    ['created_at' => ['$gte' => $monthStart, '$lt' => $monthEnd]],
                    ['createdAt' => ['$gte' => $monthStart, '$lt' => $monthEnd]],
                    ['submittedAt' => ['$gte' => $monthStart, '$lt' => $monthEnd]]
                ]
            ]);
            $monthEnrollments = $monthRegistrations + $monthApplications;
            
            $lastMonthStart = new MongoDB\BSON\UTCDateTime(strtotime('first day of last month') * 1000);
            $lastMonthEnd = new MongoDB\BSON\UTCDateTime(strtotime('first day of this month') * 1000);
            
            $lastMonthRegistrations = $registrationCollection->countDocuments([
                '$or' => [
                    ['created_at' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]],
                    ['createdAt' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]],
                    ['submittedAt' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]]
                ]
            ]);
            $lastMonthApplications = $applicationCollection->countDocuments([
                '$or' => [
                    ['created_at' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]],
                    ['createdAt' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]],
                    ['submittedAt' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]]
                ]
            ]);
            $lastMonthEnrollments = $lastMonthRegistrations + $lastMonthApplications;
            
            $monthPercentageIncrease = 0;
            if ($lastMonthEnrollments > 0) {
                $monthPercentageIncrease = round((($monthEnrollments - $lastMonthEnrollments) / $lastMonthEnrollments) * 100, 1);
            } elseif ($monthEnrollments > 0) {
                $monthPercentageIncrease = 100;
            }
            
            $lastMonthPendingRegs = $registrationCollection->countDocuments([
                'status' => 'pending',
                '$or' => [
                    ['created_at' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]],
                    ['createdAt' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]],
                    ['submittedAt' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]]
                ]
            ]);
            $lastMonthPendingApps = $applicationCollection->countDocuments([
                'status' => 'pending',
                '$or' => [
                    ['created_at' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]],
                    ['createdAt' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]],
                    ['submittedAt' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]]
                ]
            ]);
            $lastMonthPending = $lastMonthPendingRegs + $lastMonthPendingApps;
            
            $pendingPercentageChange = 0;
            if ($lastMonthPending > 0) {
                $pendingPercentageChange = round((($pendingEnrollments - $lastMonthPending) / $lastMonthPending) * 100, 1);
            } elseif ($pendingEnrollments > 0) {
                $pendingPercentageChange = 100;
            }
            
            $lastMonthCancelledRegs = $registrationCollection->countDocuments([
                'status' => ['$in' => ['cancelled', 'rejected']],
                '$or' => [
                    ['created_at' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]],
                    ['createdAt' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]],
                    ['submittedAt' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]]
                ]
            ]);
            $lastMonthCancelledApps = $applicationCollection->countDocuments([
                'status' => ['$in' => ['cancelled', 'rejected']],
                '$or' => [
                    ['created_at' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]],
                    ['createdAt' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]],
                    ['submittedAt' => ['$gte' => $lastMonthStart, '$lt' => $lastMonthEnd]]
                ]
            ]);
            $lastMonthCancelled = $lastMonthCancelledRegs + $lastMonthCancelledApps;
            
            $cancelledPercentageChange = 0;
            if ($lastMonthCancelled > 0) {
                $cancelledPercentageChange = round((($cancelledEnrollments - $lastMonthCancelled) / $lastMonthCancelled) * 100, 1);
            } elseif ($cancelledEnrollments > 0) {
                $cancelledPercentageChange = 100;
            }
            
            $yearStart = new MongoDB\BSON\UTCDateTime(strtotime("$year-01-01") * 1000);
            $yearEnd = new MongoDB\BSON\UTCDateTime(strtotime(($year + 1) . "-01-01") * 1000);
            
            $currentYearRegistrations = $registrationCollection->countDocuments([
                '$or' => [
                    ['created_at' => ['$gte' => $yearStart, '$lt' => $yearEnd]],
                    ['createdAt' => ['$gte' => $yearStart, '$lt' => $yearEnd]],
                    ['submittedAt' => ['$gte' => $yearStart, '$lt' => $yearEnd]]
                ]
            ]);
            $currentYearApplications = $applicationCollection->countDocuments([
                '$or' => [
                    ['created_at' => ['$gte' => $yearStart, '$lt' => $yearEnd]],
                    ['createdAt' => ['$gte' => $yearStart, '$lt' => $yearEnd]],
                    ['submittedAt' => ['$gte' => $yearStart, '$lt' => $yearEnd]]
                ]
            ]);
            $currentYearEnrollments = $currentYearRegistrations + $currentYearApplications;
            
            $prevYearStart = new MongoDB\BSON\UTCDateTime(strtotime(($year - 1) . "-01-01") * 1000);
            $prevYearEnd = new MongoDB\BSON\UTCDateTime(strtotime("$year-01-01") * 1000);
            
            $prevYearRegistrations = $registrationCollection->countDocuments([
                '$or' => [
                    ['created_at' => ['$gte' => $prevYearStart, '$lt' => $prevYearEnd]],
                    ['createdAt' => ['$gte' => $prevYearStart, '$lt' => $prevYearEnd]],
                    ['submittedAt' => ['$gte' => $prevYearStart, '$lt' => $prevYearEnd]]
                ]
            ]);
            $prevYearApplications = $applicationCollection->countDocuments([
                '$or' => [
                    ['created_at' => ['$gte' => $prevYearStart, '$lt' => $prevYearEnd]],
                    ['createdAt' => ['$gte' => $prevYearStart, '$lt' => $prevYearEnd]],
                    ['submittedAt' => ['$gte' => $prevYearStart, '$lt' => $prevYearEnd]]
                ]
            ]);
            $previousYearEnrollments = $prevYearRegistrations + $prevYearApplications;
            
            $yearGrowthPercentage = 0;
            if ($previousYearEnrollments > 0) {
                $yearGrowthPercentage = round((($currentYearEnrollments - $previousYearEnrollments) / $previousYearEnrollments) * 100, 1);
            } elseif ($currentYearEnrollments > 0) {
                $yearGrowthPercentage = 100;
            }
            
            $monthlyEnrollments = array_fill(0, 12, 0);
            for ($month = 1; $month <= 12; $month++) {
                $monthStartDate = new MongoDB\BSON\UTCDateTime(strtotime("$year-$month-01") * 1000);
                $nextMonth = $month == 12 ? 1 : $month + 1;
                $nextYear = $month == 12 ? $year + 1 : $year;
                $monthEndDate = new MongoDB\BSON\UTCDateTime(strtotime("$nextYear-$nextMonth-01") * 1000);
                
                $monthRegs = $registrationCollection->countDocuments([
                    '$or' => [
                        ['created_at' => ['$gte' => $monthStartDate, '$lt' => $monthEndDate]],
                        ['createdAt' => ['$gte' => $monthStartDate, '$lt' => $monthEndDate]],
                        ['submittedAt' => ['$gte' => $monthStartDate, '$lt' => $monthEndDate]]
                    ]
                ]);
                $monthApps = $applicationCollection->countDocuments([
                    '$or' => [
                        ['created_at' => ['$gte' => $monthStartDate, '$lt' => $monthEndDate]],
                        ['createdAt' => ['$gte' => $monthStartDate, '$lt' => $monthEndDate]],
                        ['submittedAt' => ['$gte' => $monthStartDate, '$lt' => $monthEndDate]]
                    ]
                ]);
                
                $monthlyEnrollments[$month - 1] = $monthRegs + $monthApps;
            }
            
            $previousYearMonthlyEnrollments = array_fill(0, 12, 0);
            for ($month = 1; $month <= 12; $month++) {
                $monthStartDate = new MongoDB\BSON\UTCDateTime(strtotime(($year - 1) . "-$month-01") * 1000);
                $nextMonth = $month == 12 ? 1 : $month + 1;
                $nextYear = $month == 12 ? $year : $year - 1;
                $monthEndDate = new MongoDB\BSON\UTCDateTime(strtotime("$nextYear-$nextMonth-01") * 1000);
                
                $monthRegs = $registrationCollection->countDocuments([
                    '$or' => [
                        ['created_at' => ['$gte' => $monthStartDate, '$lt' => $monthEndDate]],
                        ['createdAt' => ['$gte' => $monthStartDate, '$lt' => $monthEndDate]],
                        ['submittedAt' => ['$gte' => $monthStartDate, '$lt' => $monthEndDate]]
                    ]
                ]);
                $monthApps = $applicationCollection->countDocuments([
                    '$or' => [
                        ['created_at' => ['$gte' => $monthStartDate, '$lt' => $monthEndDate]],
                        ['createdAt' => ['$gte' => $monthStartDate, '$lt' => $monthEndDate]],
                        ['submittedAt' => ['$gte' => $monthStartDate, '$lt' => $monthEndDate]]
                    ]
                ]);
                
                $previousYearMonthlyEnrollments[$month - 1] = $monthRegs + $monthApps;
            }
            
            error_log("Statistics - Total Trainees: $totalTrainees, Registrations: $totalRegistrations, Applications: $totalApplications");
            error_log("Today's Enrollments: $todayEnrollments, Approved: $approvedEnrollments, Pending: $pendingEnrollments, Cancelled: $cancelledEnrollments");
            
            $coursesCollection = $db->courses;
            $topCourses = [];
            
            $allCourses = $coursesCollection->find();
            foreach ($allCourses as $course) {
                $courseArray = (array)$course;
                $courseName = $courseArray['title'] ?? $courseArray['name'] ?? 'Unknown Course';
                
                $courseEnrollments = 0;
                
                $courseEnrollments += $registrationCollection->countDocuments([
                    'course' => $courseName,
                    'status' => 'approved'
                ]);
                
                $courseEnrollments += $applicationCollection->countDocuments([
                    'course' => $courseName,
                    'status' => 'approved'
                ]);
                
                $topCourses[] = [
                    'name' => $courseName,
                    'image' => $courseArray['image'] ?? '',
                    'hours' => $courseArray['hours'] ?? $courseArray['duration'] ?? 'N/A',
                    'enrollmentCount' => $courseEnrollments
                ];
            }
            
            usort($topCourses, function($a, $b) {
                return $b['enrollmentCount'] - $a['enrollmentCount'];
            });
            $topCourses = array_slice($topCourses, 0, 5);
            
            return [
                'total' => $totalTrainees,
                'totalEnrollment' => $totalRegistrations + $totalApplications,
                'totalRegistrations' => $totalRegistrations,
                'totalApplications' => $totalApplications,
                'todayEnrollments' => $todayEnrollments,
                'todayPercentageIncrease' => $todayPercentageIncrease,
                'approvedEnrollments' => $approvedEnrollments,
                'pendingEnrollments' => $pendingEnrollments,
                'pendingPercentageChange' => $pendingPercentageChange,
                'cancelledEnrollments' => $cancelledEnrollments,
                'cancelledPercentageChange' => $cancelledPercentageChange,
                'monthEnrollments' => $monthEnrollments,
                'monthPercentageIncrease' => $monthPercentageIncrease,
                'currentYearEnrollments' => $currentYearEnrollments,
                'previousYearEnrollments' => $previousYearEnrollments,
                'yearGrowthPercentage' => $yearGrowthPercentage,
                'active_trainees' => $activeTrainees,
                'graduates' => $graduates,
                'monthly_enrollments' => $monthlyEnrollments,
                'previous_year_monthly_enrollments' => $previousYearMonthlyEnrollments,
                'topCourses' => $topCourses,
                'totalEnrollments' => $totalRegistrations + $totalApplications,
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
                'todayEnrollments' => 0,
                'todayPercentageIncrease' => 0,
                'approvedEnrollments' => 0,
                'pendingEnrollments' => 0,
                'pendingPercentageChange' => 0,
                'cancelledEnrollments' => 0,
                'cancelledPercentageChange' => 0,
                'monthEnrollments' => 0,
                'monthPercentageIncrease' => 0,
                'currentYearEnrollments' => 0,
                'previousYearEnrollments' => 0,
                'yearGrowthPercentage' => 0,
                'active_trainees' => 0,
                'graduates' => 0,
                'monthly_enrollments' => array_fill(0, 12, 0),
                'previous_year_monthly_enrollments' => array_fill(0, 12, 0),
                'year' => date('Y')
            ];
        }
    }
    

    
}
