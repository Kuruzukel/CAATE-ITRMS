<?php

/**
 * IDE helper stubs for MongoDB extension classes.
 *
 * These classes exist purely so static analysis tools (like Intelephense)
 * can understand the MongoDB types used in the codebase.
 *
 * They are guarded with class_exists checks so that if the MongoDB PHP
 * extension is installed, the real classes will be used at runtime and
 * these stubs will never be loaded.
 */

namespace MongoDB\BSON {

    if (!class_exists(\MongoDB\BSON\ObjectId::class)) {
        class ObjectId
        {
            /**
             * @param string|null $id
             */
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
            /**
             * @param int|float|string|null $milliseconds
             */
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

