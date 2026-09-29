import os
from pathlib import Path
import unittest
from unittest.mock import Mock

from specimen_screening import GEM_PROMPTS, IMITATION_PROMPTS, OTHER_PROMPTS, screen_specimen


def classifier_with_scores(gem, negative, winner=None):
    def classify(image, candidate_labels):
        weights = {
            label: (gem if label in GEM_PROMPTS else negative)
            for label in candidate_labels
        }
        if winner is not None:
            weights[winner] = max(gem, negative) * 3
        total = sum(weights.values())
        return [
            {'label': label, 'score': weights[label] / total}
            for label in reversed(candidate_labels)
        ]
    return Mock(side_effect=classify)


class ScreeningTests(unittest.TestCase):
    def test_glass_is_rejected(self):
        classifier = classifier_with_scores(.02, .08)
        self.assertEqual(screen_specimen(classifier, object()), 'uncertain')
        self.assertEqual(classifier.call_count, 1)

    def test_weak_gem_lead_is_rejected(self):
        self.assertEqual(screen_specimen(classifier_with_scores(.11, .10), object()), 'uncertain')

    def test_gem_winner_requires_a_clear_margin(self):
        self.assertEqual(screen_specimen(classifier_with_scores(.16, .10), object()), 'passed')

    def test_many_lower_imitation_scores_do_not_outvote_gem(self):
        classifier = classifier_with_scores(.30, .10)
        self.assertEqual(screen_specimen(classifier, object()), 'passed')
        self.assertEqual(classifier.call_count, 1)

    def test_each_gem_appearance_can_pass(self):
        for prompt in GEM_PROMPTS:
            with self.subTest(prompt=prompt):
                self.assertEqual(screen_specimen(classifier_with_scores(.10, .10, prompt), object()), 'passed')

    def test_each_imitation_and_irrelevant_winner_is_rejected(self):
        for prompt in IMITATION_PROMPTS + OTHER_PROMPTS:
            with self.subTest(prompt=prompt):
                self.assertEqual(screen_specimen(classifier_with_scores(.10, .10, prompt), object()), 'uncertain')

    def test_tie_is_rejected(self):
        self.assertEqual(screen_specimen(classifier_with_scores(.10, .10), object()), 'uncertain')

    def test_screening_unavailable_blocks_analysis(self):
        self.assertEqual(screen_specimen(None, object()), 'unavailable')
        for response in ([], [{'label': GEM_PROMPTS[0], 'score': float('nan')}],
                         [{'label': GEM_PROMPTS[0], 'score': .9}]):
            with self.assertLogs('specimen_screening', level='ERROR'):
                self.assertEqual(screen_specimen(Mock(return_value=response), object()), 'unavailable')
        with self.assertLogs('specimen_screening', level='ERROR'):
            self.assertEqual(screen_specimen(Mock(side_effect=RuntimeError('offline')), object()), 'unavailable')


@unittest.skipUnless(os.environ.get('RUN_CLIP_SCREENING_TESTS') == '1',
                     'Opt-in integration check using locally cached CLIP weights')
class SamplePhotoTests(unittest.TestCase):
    def test_project_gem_photos_are_accepted(self):
        os.environ['USE_TF'] = '0'
        os.environ['USE_TORCH'] = '1'
        os.environ['HF_HUB_OFFLINE'] = '1'
        from PIL import Image
        from transformers import pipeline

        classifier = pipeline('zero-shot-image-classification', model='openai/clip-vit-base-patch32')
        root = Path(__file__).resolve().parents[2] / 'public' / 'images'
        for name in ('blue_sapphire.jpg', 'cats_eye.jpg', 'padparadscha.jpg', 'ruby.jpg'):
            with self.subTest(photo=name), Image.open(root / name) as image:
                self.assertEqual(screen_specimen(classifier, image.convert('RGB')), 'passed')


if __name__ == '__main__':
    unittest.main()
