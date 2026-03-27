<?php

namespace MongoDB\BSON {

    if (!class_exists(\MongoDB\BSON\ObjectId::class)) {
        class ObjectId
        {
            
            public function __construct($id = null)
            {
            }

            public function __toString(): string
            {
                return '';
            }
        }
    }

    if (!class_exists(\MongoDB\BSON\UTCDateTime::class)) {
        class UTCDateTime
        {
            
            public function __construct($milliseconds = null)
            {
            }

            public function toDateTime(): \DateTime
            {
                return new \DateTime();
            }
        }
    }
}

