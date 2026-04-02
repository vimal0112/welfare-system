DELETE FROM scheme_details;
DELETE FROM schemes;

INSERT INTO schemes 
(scheme_name, min_age, max_age, max_income, category, gender, location, occupation, description, disability_required, minority_required) 
VALUES 
('PM Kisan', 18, 60, 500000, 'Farmer', 'Any', 'Rural', 'Farmer', 'Financial support for farmers', 'No', 'No'),
('Ayushman Bharat', 0, 100, 300000, 'Health', 'Any', 'All', 'Any', 'Health insurance scheme', 'No', 'Yes'),
('MGNREGA', 18, 60, 200000, 'Employment', 'Any', 'Rural', 'Labor', 'Employment guarantee scheme', 'No', 'No'),
('PM Awas Yojana', 18, 60, 300000, 'Housing', 'Any', 'Urban', 'Any', 'Affordable housing scheme', 'No', 'No'),
('Startup India', 18, 45, 1000000, 'Entrepreneur', 'Any', 'All', 'Business', 'Support for startups', 'No', 'No'),
('Skill India', 18, 35, 300000, 'Youth', 'Any', 'All', 'Student', 'Skill development program', 'No', 'No'),
('Beti Bachao', 0, 25, 300000, 'Women', 'Female', 'All', 'Student', 'Girl child education scheme', 'No', 'No'),
('Ujjwala Yojana', 18, 60, 200000, 'Women', 'Female', 'Rural', 'Housewife', 'Free LPG connections', 'No', 'Yes'),
('National Pension Scheme', 18, 65, 1000000, 'Pension', 'Any', 'All', 'Any', 'Retirement savings scheme', 'No', 'No'),
('Digital India', 18, 40, 500000, 'Technology', 'Any', 'All', 'Student', 'Digital empowerment initiative', 'No', 'No');
