-- ============================================
-- CycloneGems AI - Gemstone Seed Data
-- ============================================
-- Run this FOURTH (populates the gemstones table)
-- Contains common Sri Lankan gemstone varieties with market data

INSERT INTO gemstones (name, scientific_name, description, hardness_mohs, typical_colors, origin_regions, base_price_usd_min, base_price_usd_max, rarity_score) VALUES

('Blue Sapphire', 'Corundum (Al₂O₃)', 
 'The Ceylon Blue Sapphire is world-renowned for its cornflower blue color and exceptional clarity. Sri Lanka has been a source of fine sapphires for over 2,000 years.',
 9.0, ARRAY['Cornflower Blue', 'Royal Blue', 'Vivid Blue'], ARRAY['Ratnapura', 'Elahera', 'Balangoda'],
 200.00, 15000.00, 7),

('Ruby', 'Corundum (Al₂O₃)',
 'Sri Lankan rubies range from pinkish-red to deep pigeon blood red. While less famous than Burmese rubies, Ceylon rubies are prized for their clarity and brilliance.',
 9.0, ARRAY['Pigeon Blood Red', 'Pinkish Red', 'Purplish Red'], ARRAY['Elahera', 'Ratnapura', 'Embilipitiya'],
 300.00, 12000.00, 8),

('Cat''s Eye', 'Chrysoberyl (BeAl₂O₄)',
 'Sri Lankan Cat''s Eye chrysoberyl displays a sharp chatoyant band (cat''s eye effect) across a honey-colored cabochon. Highly valued for its optical phenomenon.',
 8.5, ARRAY['Honey', 'Golden Green', 'Brownish Yellow'], ARRAY['Matale', 'Morawaka', 'Ratnapura'],
 100.00, 8000.00, 7),

('Padparadscha', 'Corundum (Al₂O₃)',
 'The rarest and most valuable sapphire variety, displaying a unique pinkish-orange color reminiscent of a lotus blossom. Exclusively found in Sri Lanka.',
 9.0, ARRAY['Pinkish Orange', 'Salmon', 'Sunset Orange'], ARRAY['Ratnapura', 'Elahera'],
 1000.00, 30000.00, 10),

('Star Sapphire', 'Corundum (Al₂O₃)',
 'Star sapphires exhibit asterism — a six-rayed star that appears to glide across the surface. Sri Lanka produces some of the world''s finest star sapphires.',
 9.0, ARRAY['Blue', 'Grey Blue', 'Pink'], ARRAY['Ratnapura', 'Rakwana'],
 150.00, 6000.00, 8),

('Alexandrite', 'Chrysoberyl (BeAl₂O₄)',
 'One of the rarest gemstones, alexandrite changes color from green in daylight to red in incandescent light. Sri Lankan specimens are highly coveted.',
 8.5, ARRAY['Green (daylight)', 'Red (incandescent)', 'Brownish Green'], ARRAY['Ratnapura', 'Matale'],
 500.00, 20000.00, 9),

('Spinel', 'Spinel (MgAl₂O₄)',
 'Sri Lankan spinels come in a wide range of colors. Once confused with rubies and sapphires, spinels are now recognized as premium gems in their own right.',
 8.0, ARRAY['Red', 'Blue', 'Pink', 'Purple'], ARRAY['Ratnapura', 'Elahera', 'Okkampitiya'],
 50.00, 3000.00, 6),

('Topaz', 'Topaz (Al₂SiO₄(F,OH)₂)',
 'Sri Lankan topaz is typically found in golden, yellow, and blue varieties. Known for excellent clarity and hardness, it makes a durable jewelry stone.',
 8.0, ARRAY['Golden', 'Yellow', 'Blue', 'Colorless'], ARRAY['Ratnapura', 'Okkampitiya'],
 20.00, 500.00, 4),

('Garnet', 'Garnet Group',
 'Garnets from Sri Lanka include almandine, pyrope, and rare color-change varieties. The hessonite (cinnamon stone) garnet is particularly notable.',
 7.0, ARRAY['Red', 'Orange (Hessonite)', 'Green (Tsavorite)', 'Purple'], ARRAY['Ratnapura', 'Embilipitiya', 'Elahera'],
 10.00, 300.00, 3),

('Tourmaline', 'Tourmaline Group',
 'Sri Lanka produces tourmaline in many colors. Green, pink, and watermelon tourmaline varieties are particularly sought after by collectors.',
 7.0, ARRAY['Green', 'Pink', 'Blue', 'Watermelon'], ARRAY['Ratnapura', 'Matale'],
 30.00, 800.00, 5),

('Zircon', 'Zircon (ZrSiO₄)',
 'Natural zircon from Sri Lanka should not be confused with cubic zirconia. The blue and golden varieties are especially prized for their high dispersion.',
 7.5, ARRAY['Blue', 'Golden', 'Green', 'Colorless'], ARRAY['Ratnapura', 'Matara'],
 15.00, 400.00, 4),

('Moonstone', 'Feldspar (KAlSi₃O₈)',
 'Sri Lanka is the world''s primary source of blue moonstone, prized for its adularescence — a billowy blue light that floats across the gem''s surface.',
 6.0, ARRAY['Blue Sheen', 'Rainbow', 'White'], ARRAY['Meetiyagoda', 'Ambalangoda', 'Dumbara'],
 5.00, 200.00, 5)

ON CONFLICT (name) DO NOTHING;
