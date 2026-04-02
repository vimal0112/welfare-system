-- Insert into schemes
INSERT INTO schemes 
(scheme_name, min_age, max_age, max_income, category, gender, location, occupation, description, disability_required, minority_required) 
VALUES 
('PM Kisan', 18, 60, 500000, 'Farmer', 'Any', 'Rural', 'Farmer', 'Financial support for farmers', 'No', 'No'),

('Ayushman Bharat', 0, 100, 300000, 'Health', 'Any', 'All', 'Any', 'Health insurance scheme', 'No', 'Yes'),

('MGNREGA', 18, 60, 200000, 'Employment', 'Any', 'Rural', 'Labor', 'Employment guarantee scheme', 'No', 'No');


-- Insert into scheme_details
INSERT INTO scheme_details 
(scheme_id, eligibility, benefits, documents_required, application_process, official_website, helpline_number) 
VALUES 

(1, 'Farmers with land ownership', '6000 per year', 'Aadhar, Land proof', 'Apply online', 'https://pmkisan.gov.in', '1800-111-111'),

(2, 'Low income families', 'Free medical treatment', 'Aadhar, Income certificate', 'Hospital registration', 'https://pmjay.gov.in', '14555'),

(3, 'Rural unemployed citizens', '100 days wage employment', 'Aadhar, Job card', 'Apply at panchayat', 'https://nrega.nic.in', '1800-222-333');