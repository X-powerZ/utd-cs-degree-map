

CS_COURSE_REQS = {
    "CS1200": {
        "prereq": [],
        "coreq": []
    },
    "ECS1100": {
        "prereq": [],
        "coreq": []
    },
    "ECS2390": {
        "prereq": [
            {"RHET1302"}
        ],
        "coreq": []
    },
    "CS1436": {
        "prereq": [],
        "coreq": []
    },
    "CS1337": {
        "prereq": [
            {"CS1436"}
        ],
        "coreq": []
    },
    "CS2305": {
        "prereq": [
            {"MATH2413", "MATH2417"}
        ],
        "coreq": []
    },
    "CS2336": {
        "prereq": [
            {"CS1337"}
        ],
        "coreq": [{"CS2305", "CE2305"}]
    },
    "CS2337": {
        "prereq": [
            {"CS1337"}
        ],
        "coreq": [{"CS2305", "CE2305"}]
    },
    "CS2340": {
        "prereq": [
            {"CS1337"},
            {"CE2305", "CS2305"}
        ],
        "coreq": []
    },
    "CS3162": {
        "prereq": [],
        "coreq": [{"ECS2390"},
            {"GOVT2305"}]
    },
    "CS3341": {
        "prereq": [
            {"MATH1326", "MATH2414", "MATH2419"},
            {"MATH2418"},
            {"CE2305", "CS2305"}
        ],
        "coreq": []
    },
    "CS3345": {
        "prereq": [
            {"CE2305", "CS2305"},
            {"CE2336", "CS2336", "CS2337"}
        ],
        "coreq": [{"SE3341", "CS3341", "ENGR33341"}]
    },
    "CS3354": {
        "prereq": [
            {"CE2305", "CS2305"},
            {"CE2336", "CS2336", "CS2337", "CS3333"}
        ],
        "coreq": [
            {"ECS2390"}
        ]
    },
    "CS3377": {
        "prereq": [
            {"CE2336", "CS2336", "CS2337"}
        ],
        "coreq": []
    },
    "CS4314": {
        "prereq": [
            {"MATH2414", "MATH2419"},
            {"CS3341", "SE3341"},
            {"MATH2418"}
        ],
        "coreq": []
    },
    "CS4315": {
        "prereq": [
            {"CGS4314", "CS4314"}
        ],
        "coreq": []
    },
    "CS4332": {
        "prereq": [
            {"CE3345", "CS3345", "SE3345"}
        ],
        "coreq": []
    },
    "CS4334": {
        "prereq": [
            {"MATH2370", "CS1324", "CS1325", "CE1337", "CS1337"},
            {"MATH2418"},
            {"MATH2451", "MATH3351"}
        ],
        "coreq": []
    },
    "CS4336": {
        "prereq": [
            {"CE2336", "CS2336", "CS2337"}
        ],
        "coreq": []
    },
    "CS4337": {
        "prereq": [
            {"CE2336", "CS2336", "CS2337", "CS3333"},
            {"CE2305", "CS2305"},
            {"CS2340", "SE2340", "CE4304", "EE4304"}
        ],
        "coreq": []
    },
    "CS4339": {
        "prereq": [
            {"CS4347", "SE4347"}
        ],
        "coreq": []
    },
    "CS4341": {
        "prereq": [
            {"CE2310", "EE2310", "CS2340", "SE2340"},
            {"PHYS2326"}
        ],
        "coreq": [
            {"CS4141"}
        ]
    },
    "CS4141": {
        "prereq": [
            {"CE2310", "EE2310", "CS2340", "SE2340"},
            {"PHYS2326"}
        ],
        "coreq": [
            {"CS4341"}
        ]
    },
    "CS4347": {
        "prereq": [
            {"CE3345", "CS3345", "SE3345"}
        ],
        "coreq": []
    },
    "CS4348": {
        "prereq": [
            {"CS2340", "SE2340"},
            {"CS3377", "SE3377"},
            {"CE3345", "CS3345", "SE3345"}
        ],
        "coreq": []
    },
    "CS4349": {
        "prereq": [
            {"CE2305", "CS2305"},
            {"CE3345", "CS3345", "SE3345"}
        ],
        "coreq": []
    },
    "CS4352": {
        "prereq": [],
        "coreq": []
    },
    "CS4361": {
        "prereq": [
            {"MATH2418"},
            {"CE2336", "CS2336", "CS2337"},
            {"CE3345", "CS3345", "SE3345"}
        ],
        "coreq": []
    },
    "CS4365": {
        "prereq": [
            {"CE3345", "CS3345", "SE3345"}
        ],
        "coreq": []
    },
    "CS4375": {
        "prereq": [
            {"CS3341", "SE3341"},
            {"CE3345", "CS3345", "SE3345"}
        ],
        "coreq": []
    },
    "CS4376": {
        "prereq": [
            {"CE2336", "CS2336", "CS2337"},
            {"CE3354", "CS3354", "SE3354"}
        ],
        "coreq": []
    },
    "CS4384": {
        "prereq": [
            {"CE2305", "CS2305"}
        ],
        "coreq": []
    },
    "CS4386": {
        "prereq": [
            {"CE3345", "CS3345", "SE3345"}
        ],
        "coreq": []
    },
    "CS4389": {
        "prereq": [
            {"CS4347", "SE4347"}
        ],
        "coreq": []
    },
    "CS4390": {
        "prereq": [
            {"CE3345", "CS3345", "SE3345"}
        ],
        "coreq": []
    },
    "CS4391": {
        "prereq": [
            {"CE3345", "CS3345", "SE3345"}
        ],
        "coreq": []
    },
    "CS4392": {
        "prereq": [
            {"MATH2418"},
            {"CE3345", "CS3345", "SE3345"}
        ],
        "coreq": []
    },
    "CS4393": {
        "prereq": [
            {"CE4348", "CS4348", "SE4348"},
            {"CE4390", "CS4390"}
        ],
        "coreq": []
    },
    "CS4394": {
        "prereq": [
            {"CE4348", "CS4348", "SE4348"}
        ],
        "coreq": []
    },
    "CS4395": {
        "prereq": [
            {"CS3341", "SE3341"},
            {"CE3345", "CS3345", "SE3345"}
        ],
        "coreq": []
    },
    "CS4396": {
        "prereq": [
            {"CS4390"}
        ],
        "coreq": []
    },
    "CS4397": {
        "prereq": [
            {"CE4348", "CS4348", "SE4348"}
        ],
        "coreq": []
    },
    "CS4398": {
        "prereq": [
            {"CE4348", "CS4348", "SE4348"},
            {"CE4390", "CS4390"}
        ],
        "coreq": []
    },
    "CS4399": {
        "prereq": [
            {"Instructor consent required"}
        ],
        "coreq": []
    },
    "CS4459": {
        "prereq": [
            {"CS2340", "SE2340"},
            {"CS3345", "SE3345"},
            {"CS3377", "SE3377"}
        ],
        "coreq": []
    },
    "CS4485": {
        "prereq": [
            {"CS3345", "CE3345", "SE3345"},
            {"CE3354", "CS3354", "SE3354"}
        ],
        "coreq": []
    }
}



GENERAL_COURSE_PREREQS = {
    "PHYS2325/2125": []

}