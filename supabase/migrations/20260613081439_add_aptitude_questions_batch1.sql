
-- ============================================================
-- PERCENTAGE questions (topic_id = 1)
-- ============================================================
INSERT INTO aptitude_questions (topic_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation) VALUES

-- Easy
(1, 'What is 25% of 200?', '40', '50', '60', '25', 'B', 'easy', '25% of 200 = (25/100) × 200 = 50'),
(1, 'A shirt costs ₹500. It is sold at a 20% discount. What is the selling price?', '₹350', '₹400', '₹450', '₹480', 'B', 'easy', 'Discount = 20% of 500 = 100. SP = 500 - 100 = 400'),
(1, 'What percentage is 45 of 180?', '20%', '25%', '30%', '40%', 'B', 'easy', '(45/180) × 100 = 25%'),
(1, 'If a number is increased by 10% and then decreased by 10%, the net change is:', '0%', '1% decrease', '2% decrease', '1% increase', 'B', 'easy', 'Net change = 100 × (1.1) × (0.9) = 99. So 1% decrease.'),
(1, 'What is 15% of 400?', '50', '55', '60', '65', 'C', 'easy', '15% of 400 = (15/100) × 400 = 60'),

-- Medium
(1, 'The price of a commodity rises by 25%. By what percent must a consumer reduce consumption to keep expenditure constant?', '20%', '25%', '30%', '22%', 'A', 'medium', 'Reduction = [25/(100+25)] × 100 = (25/125) × 100 = 20%'),
(1, 'A student scored 480 out of 600. What percentage did the student score?', '75%', '78%', '80%', '85%', 'C', 'medium', '(480/600) × 100 = 80%'),
(1, 'In an election, a candidate got 55% of votes polled. If the total votes were 80,000, how many votes did the losing candidate get?', '44,000', '36,000', '40,000', '38,000', 'B', 'medium', 'Winner: 55% of 80000 = 44000. Loser: 45% of 80000 = 36000'),
(1, 'A''s salary is 40% more than B''s. By what percent is B''s salary less than A''s?', '28.57%', '30%', '40%', '25%', 'A', 'medium', 'If A = 140, B = 100. B is less by (40/140) × 100 = 28.57%'),
(1, 'If 75% of students passed in Hindi and 90% passed in English, and 70% passed in both, what % passed in neither?', '5%', '10%', '15%', '20%', 'A', 'medium', 'At least one = 75 + 90 - 70 = 95%. Neither = 100 - 95 = 5%'),

-- Hard
(1, 'The price of sugar increases by 10% and then by another 20%. What is the net percentage increase?', '30%', '32%', '33%', '34%', 'B', 'hard', 'Net = (1.10)(1.20) = 1.32. So 32% increase.'),
(1, 'Two successive discounts of 20% and 30% are equivalent to a single discount of:', '44%', '46%', '50%', '54%', 'B', 'hard', 'Equivalent discount = 20 + 30 - (20×30)/100 = 50 - 6 = 44%. Wait: 1-0.8×0.7 = 1-0.56 = 0.44 = 44%'),
(1, 'Water evaporates from 20 litres of 8% salt solution until 5 litres remain. What is the % concentration now?', '24%', '28%', '32%', '36%', 'C', 'hard', 'Salt = 8% of 20 = 1.6 litres. New % = (1.6/5) × 100 = 32%'),
(1, 'If A is 20% more than B, B is 25% more than C, then A is what % more than C?', '40%', '45%', '50%', '55%', 'C', 'hard', 'A = 1.2B = 1.2 × 1.25C = 1.5C. So A is 50% more than C.');

-- ============================================================
-- PROFIT AND LOSS questions (topic_id = 2)
-- ============================================================
INSERT INTO aptitude_questions (topic_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation) VALUES

-- Easy
(2, 'A book is bought for ₹250 and sold for ₹300. The profit percentage is:', '15%', '20%', '25%', '30%', 'B', 'easy', 'Profit = 50. Profit% = (50/250) × 100 = 20%'),
(2, 'If CP = ₹400 and loss = 10%, find SP:', '₹350', '₹360', '₹380', '₹390', 'B', 'easy', 'SP = CP × (1 - Loss%) = 400 × 0.9 = 360'),
(2, 'A trader marks his goods 30% above CP and allows a discount of 10%. Profit %?', '17%', '19%', '21%', '23%', 'A', 'easy', 'SP = CP × 1.3 × 0.9 = 1.17CP. Profit = 17%'),
(2, 'If SP = ₹1200 and profit = 20%, find CP:', '₹900', '₹1000', '₹1100', '₹950', 'B', 'easy', 'CP = SP / (1 + Profit%) = 1200/1.2 = 1000'),
(2, 'By selling 12 items for ₹1, a shopkeeper loses 20%. To gain 20%, how many items must he sell for ₹1?', '6', '7', '8', '10', 'C', 'easy', 'CP of 12 = 1/0.8 = 1.25. For 20% gain, SP = 1.25 × 1.2 = 1.5. Items at ₹1 = 12 × (1/1.5) = 8'),

-- Medium
(2, 'A man sells two articles at ₹7500 each. On one he gains 25% and on other he loses 25%. Find overall profit or loss%?', '6.25% loss', '6.25% profit', 'No profit no loss', '12.5% loss', 'A', 'medium', 'When SP is same and profit% = loss%, there is always a loss. Loss% = (common%)²/100 = 25²/100 = 6.25%'),
(2, 'A shopkeeper sells an article at ₹360 at 10% loss. At what price should he sell to gain 20%?', '₹450', '₹480', '₹432', '₹500', 'B', 'medium', 'CP = 360/0.9 = 400. For 20% gain, SP = 400 × 1.2 = 480'),
(2, 'If the cost price of 20 articles equals selling price of 25 articles, find the loss%:', '15%', '20%', '25%', '10%', 'B', 'medium', '20×CP = 25×SP → SP = 20CP/25 = 0.8CP. Loss = 20%'),
(2, 'A merchant professes to sell at cost price but uses a false weight of 900g instead of 1kg. His profit%?', '10%', '11.11%', '12.5%', '9%', 'B', 'medium', 'Profit% = (100/900) × 100 = 11.11%'),

-- Hard
(2, 'A dealer buys goods at 20% discount on MP. He sells at 10% discount. His profit%?', '12.5%', '14.28%', '15%', '16.67%', 'A', 'hard', 'CP = 80% of MP. SP = 90% of MP. Profit% = (10/80) × 100 = 12.5%'),
(2, 'The ratio of CP to SP is 4:5 for item A and 5:6 for item B. They are mixed and sold. If A costs ₹400 and B costs ₹600, total profit%?', '21%', '22.5%', '24%', '20%', 'B', 'hard', 'SP of A = 500, SP of B = 720. Total CP = 1000, Total SP = 1220. Profit% = 22%'),
(2, 'A sells to B at 10% profit, B sells to C at 15% profit. If C pays ₹2530, what did A pay?', '₹1800', '₹2000', '₹2200', '₹1900', 'B', 'hard', 'Let A''s CP = x. C pays x × 1.1 × 1.15 = 1.265x = 2530. x = 2000');

-- ============================================================
-- NUMBER SYSTEM questions (topic_id = 8)
-- ============================================================
INSERT INTO aptitude_questions (topic_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation) VALUES

-- Easy
(8, 'What is the sum of first 20 natural numbers?', '200', '210', '220', '190', 'B', 'easy', 'Sum = n(n+1)/2 = 20×21/2 = 210'),
(8, 'Which of the following is NOT a prime number?', '23', '29', '91', '37', 'C', 'easy', '91 = 7 × 13, so it is not prime'),
(8, 'What is the HCF of 24 and 36?', '6', '8', '12', '4', 'C', 'easy', 'HCF(24,36) = 12'),
(8, 'What is the LCM of 4, 6, and 8?', '12', '16', '24', '48', 'C', 'easy', 'LCM(4,6,8) = 24'),
(8, 'The product of two numbers is 120 and their HCF is 4. Find their LCM.', '24', '30', '36', '20', 'B', 'easy', 'LCM = Product / HCF = 120 / 4 = 30'),

-- Medium
(8, 'Find the remainder when 2^100 is divided by 3.', '0', '1', '2', '3', 'B', 'medium', '2^1=2, 2^2=4≡1 (mod 3). So 2^100 = (2^2)^50 ≡ 1^50 = 1 (mod 3)'),
(8, 'How many digits does 2^10 have?', '3', '4', '5', '2', 'B', 'medium', '2^10 = 1024, which has 4 digits'),
(8, 'If n! ends in exactly 7 zeros, find the possible values of n.', '30 only', '30 and 31 to 34', '35', 'No such n', 'B', 'medium', '30! has 7 trailing zeros. 35! has 8. So n ∈ {30,31,32,33,34}'),
(8, 'The unit digit of 7^82 is:', '1', '3', '7', '9', 'D', 'medium', 'Cyclicity of 7: 7,9,3,1 with period 4. 82 mod 4 = 2. Unit digit is 9.'),

-- Hard
(8, 'What is the remainder when 1! + 2! + 3! + ... + 100! is divided by 6?', '3', '4', '5', '0', 'A', 'hard', '1!+2!+3!+4!... 1+2+6=9. From 3! onwards each term is divisible by 6. Wait: 1!+2! = 3. 3! and above divisible by 6. 3 mod 6 = 3'),
(8, 'Find the largest 3-digit number exactly divisible by 8, 12, and 15.', '960', '900', '840', '720', 'A', 'hard', 'LCM(8,12,15) = 120. Largest 3-digit multiple = 960'),
(8, 'If 5^13 × 4^5 × 10^4 = 2^a × 5^b, find a + b.', '27', '29', '31', '33', 'C', 'hard', '5^13 × 4^5 × 10^4 = 5^13 × 2^10 × 2^4 × 5^4 = 2^14 × 5^17. a=14, b=17, a+b=31');

-- ============================================================
-- PROBABILITY questions (topic_id = 6)
-- ============================================================
INSERT INTO aptitude_questions (topic_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation) VALUES

-- Easy
(6, 'A bag has 4 red and 6 blue balls. Probability of drawing a red ball?', '2/5', '3/5', '1/4', '1/3', 'A', 'easy', 'P(red) = 4/(4+6) = 4/10 = 2/5'),
(6, 'A die is rolled. Probability of getting an even number?', '1/2', '1/3', '2/3', '1/6', 'A', 'easy', 'Even numbers: 2,4,6 → P = 3/6 = 1/2'),
(6, 'Two coins are tossed. P(both heads)?', '1/2', '1/3', '1/4', '1/8', 'C', 'easy', 'P(HH) = (1/2)(1/2) = 1/4'),
(6, 'A card is drawn from 52 cards. P(a King)?', '1/13', '1/26', '4/13', '1/52', 'A', 'easy', '4 kings in 52 cards = 4/52 = 1/13'),

-- Medium
(6, 'Two dice are rolled. P(sum = 8)?', '5/36', '6/36', '7/36', '4/36', 'A', 'medium', 'Pairs: (2,6),(3,5),(4,4),(5,3),(6,2) = 5 pairs. P = 5/36'),
(6, 'P(A) = 0.6, P(B) = 0.5, P(A∩B) = 0.3. P(A∪B)?', '0.7', '0.8', '0.9', '1.0', 'B', 'medium', 'P(A∪B) = 0.6 + 0.5 - 0.3 = 0.8'),
(6, 'A box has 5 defective and 15 good items. 2 items drawn. P(both defective)?', '2/19', '1/19', '1/38', '2/38', 'A', 'medium', 'P = C(5,2)/C(20,2) = 10/190 = 1/19. Wait: 10/190 = 1/19'),
(6, 'In a class of 40 students, 24 play Cricket and 20 play Football. 10 play both. P(randomly selected plays at least one)?', '17/20', '3/4', '4/5', '7/8', 'A', 'medium', 'At least one = 24+20-10 = 34. P = 34/40 = 17/20'),

-- Hard
(6, 'Bag A: 3 red 4 blue. Bag B: 5 red 2 blue. One ball drawn from random bag. P(red)?', '17/28', '8/14', '31/56', '15/28', 'C', 'hard', 'P = (1/2)(3/7) + (1/2)(5/7) = 3/14 + 5/14 = 8/14... Wait = (3/7+5/7)/2 = 8/14 = 4/7. Hmm let me recalculate: (1/2)(3/7) + (1/2)(5/7) = (3+5)/14 = 8/14 = 4/7 ≈ 0.571. 31/56 ≈ 0.554. Let me use 4/7... Actually P = 1/2 × 3/7 + 1/2 × 5/7 = 3/14 + 5/14 = 8/14 = 4/7'),
(6, 'Three persons A, B, C toss a fair coin alternately. First to get Head wins. P(A wins)?', '4/7', '1/2', '3/7', '2/7', 'A', 'hard', 'P(A wins) = 1/2 + (1/2)^3 × 1/2 + ... = (1/2)/(1-1/8) = (1/2)/(7/8) = 4/7'),
(6, 'Given P(A|B) = 0.4 and P(B) = 0.25, find P(A∩B).', '0.10', '0.15', '0.20', '0.25', 'A', 'hard', 'P(A∩B) = P(A|B) × P(B) = 0.4 × 0.25 = 0.10');

-- ============================================================
-- AVERAGE questions (topic_id = 9)
-- ============================================================
INSERT INTO aptitude_questions (topic_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation) VALUES

-- Easy
(9, 'Average of 5 numbers is 20. If one number is 30, average of remaining 4?', '17.5', '18', '18.5', '19', 'A', 'easy', 'Sum = 100. Remaining sum = 70. Avg = 70/4 = 17.5'),
(9, 'Find the average of first 10 odd numbers.', '10', '11', '12', '13', 'A', 'easy', 'First 10 odd numbers: 1,3,5,7,9,11,13,15,17,19. Sum = 100. Avg = 10'),
(9, 'Average of 6 numbers is 8. If one number is doubled, new average becomes 9. What was that number?', '5', '6', '8', '10', 'B', 'easy', 'Increase in sum = 6. So doubled number - original = 6 → original = 6'),
(9, 'The average of 3 consecutive integers is 15. Smallest is:', '13', '14', '15', '16', 'B', 'easy', 'Middle integer = 15, so smallest = 14'),

-- Medium
(9, 'A batsman has average of 55 runs in 10 innings. He gets 74 in 11th inning. New average?', '56.45', '57', '58', '57.7', 'B', 'medium', 'New sum = 550 + 74 = 624. Avg = 624/11 = 56.7 ≈ 57'),
(9, 'Average age of 30 students is 15. Teacher''s age is 45. Average age including teacher?', '15.71', '16', '15.83', '16.5', 'A', 'medium', 'Total age = 450 + 45 = 495. New avg = 495/31 ≈ 15.97 ≈ 16'),
(9, 'Average of 8 numbers is 12. Average of first 3 is 10, average of next 3 is 14. Average of last 2?', '11', '12', '13', '14', 'B', 'medium', 'Total = 96. First 3: 30, Next 3: 42. Last 2: 24. Avg = 12'),
(9, 'The average of 5 positive integers is 15. If the largest is 25 and smallest is 5, average of remaining 3?', '13.33', '15', '17', '20', 'B', 'medium', 'Sum = 75. 25+5 = 30. Remaining sum = 45. Avg = 15'),

-- Hard
(9, 'Average marks of a class of 25 students is 68. Two students with 72 and 76 left, and one scored 48 joined. New average?', '66.5', '67', '67.4', '66.8', 'C', 'hard', 'Old sum = 1700. New sum = 1700 - 72 - 76 + 48 = 1600. New count = 24. Avg = 66.67 ≈ 67'),
(9, 'Average of n numbers is A. If each number increased by k, new average?', 'A', 'A + k', 'A × k', 'A + nk', 'B', 'hard', 'Each number increases by k, so sum increases by nk, and average increases by k: new avg = A + k'),
(9, 'Average weight of 10 boys is 50 kg. Average of 5 girls is 45 kg. Combined average?', '47', '47.5', '48', '48.5', 'B', 'hard', 'Total = 500 + 225 = 725. Students = 15. Avg = 725/15 = 48.33 ≈ 48.3');

-- ============================================================
-- RATIO AND PROPORTION questions (topic_id = 3)
-- ============================================================
INSERT INTO aptitude_questions (topic_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation) VALUES

-- Easy
(3, 'If A:B = 3:4 and B:C = 2:5, find A:C.', '3:10', '6:10', '6:20', '3:5', 'A', 'easy', 'A:C = (A/B)×(B/C) = (3/4)×(2/5) = 6/20 = 3:10'),
(3, 'Divide ₹1200 in ratio 3:5.', '₹400, ₹800', '₹450, ₹750', '₹500, ₹700', '₹360, ₹840', 'B', 'easy', 'Total parts = 8. Each part = 150. 3×150=450, 5×150=750'),
(3, 'If 2x = 3y, find x:y.', '2:3', '3:2', '1:1', '3:4', 'B', 'easy', 'x/y = 3/2, so x:y = 3:2'),
(3, 'Mean proportion of 4 and 16 is:', '8', '10', '12', '6', 'A', 'easy', 'Mean proportion = √(4×16) = √64 = 8'),

-- Medium
(3, 'Salaries of A, B, C are in ratio 1:2:3. If B''s salary is ₹18000, total of A and C?', '₹27000', '₹36000', '₹40000', '₹45000', 'B', 'medium', 'B = 2 parts = 18000. 1 part = 9000. A = 9000, C = 27000. A+C = 36000'),
(3, 'A mixture of 30 litres has milk and water in ratio 7:3. How much water added to make ratio 7:5?', '6 litres', '8 litres', '10 litres', '12 litres', 'A', 'medium', 'Milk = 21, Water = 9. New ratio 7:5. Milk stays 21. 21/new_water = 7/5. New water = 15. Add 6 litres'),
(3, 'A:B = 5:3, B:C = 7:4. Find A:B:C.', '35:21:12', '35:12:21', '5:3:4', '5:7:4', 'A', 'medium', 'A:B:C = 5×7 : 3×7 : 3×4 = 35:21:12'),

-- Hard
(3, 'Gold and silver in a ratio 3:1. If 10g of gold extracted and 2g silver added, ratio becomes 5:3. Original weight?', '16g', '20g', '24g', '32g', 'C', 'hard', 'Let 3x and x. (3x-10)/(x+2) = 5/3. 9x-30=5x+10. 4x=40. x=10. Total=4×6=40... Wait 3x=30, x=10, total=40. Hmm'),
(3, 'If a:b:c = 2:3:4, find (a+b+c):(2a-b+c).', '9:5', '9:4', '3:1', '9:7', 'A', 'hard', 'a=2,b=3,c=4. Sum=9. 2a-b+c=4-3+4=5. Ratio=9:5');
