import unittest
from enrich_from_wikimedia import distance_km, normalize, similarity

class MatchingTests(unittest.TestCase):
    def test_normalize(self):
        self.assertEqual(normalize("Bargi DAM!"), "bargi dam")
    def test_similarity_exact(self):
        self.assertEqual(similarity("Balancing Rock", "Balancing Rock"), 1.0)
    def test_distance_same_point(self):
        self.assertAlmostEqual(distance_km(23.1, 79.9, 23.1, 79.9), 0.0, places=6)
    def test_distance_is_positive(self):
        self.assertGreater(distance_km(23.1, 79.9, 23.2, 80.0), 0)

if __name__ == "__main__":
    unittest.main()
