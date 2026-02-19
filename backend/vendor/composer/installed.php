<?php return array(
    'root' => array(
        'name' => 'caate/backend',
        'pretty_version' => 'dev-main',
        'version' => 'dev-main',
        'reference' => '6e950bd33421809a2dc5c72244f33c4a3b936725',
        'type' => 'project',
        'install_path' => __DIR__ . '/../../',
        'aliases' => array(),
        'dev' => true,
    ),
    'versions' => array(
        'caate/backend' => array(
            'pretty_version' => 'dev-main',
            'version' => 'dev-main',
            'reference' => '6e950bd33421809a2dc5c72244f33c4a3b936725',
            'type' => 'project',
            'install_path' => __DIR__ . '/../../',
            'aliases' => array(),
            'dev_requirement' => false,
        ),
        'mongodb/builder' => array(
            'dev_requirement' => false,
            'replaced' => array(
                0 => '*',
            ),
        ),
        'mongodb/mongodb' => array(
            'pretty_version' => '2.0.0',
            'version' => '2.0.0.0',
            'reference' => '04cd7edc6a28950e3fab6eccb2869d72a0541232',
            'type' => 'library',
            'install_path' => __DIR__ . '/../mongodb/mongodb',
            'aliases' => array(),
            'dev_requirement' => false,
        ),
        'psr/log' => array(
            'pretty_version' => '3.0.2',
            'version' => '3.0.2.0',
            'reference' => 'f16e1d5863e37f8d8c2a01719f5b34baa2b714d3',
            'type' => 'library',
            'install_path' => __DIR__ . '/../psr/log',
            'aliases' => array(),
            'dev_requirement' => false,
        ),
    ),
);
