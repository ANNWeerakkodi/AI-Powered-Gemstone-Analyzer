"""Visual screening before closed-set gemstone classification.

CLIP scores are relative prompt similarities, not authenticity probabilities.
Compare individual prompts: summing multiple descriptions of the same material
unfairly favors whichever material has more descriptions.
"""

import logging
import math

GEM_PROMPTS = (
    'a photo of a cut and polished gemstone',
    'a photo of a faceted gemstone',
    'a photo of a polished cabochon gemstone',
    'a photo of a sapphire, ruby, emerald, or other precious gemstone',
    'a photo of a rough natural gemstone mineral specimen',
    'a close-up photo of a gemstone set in jewelry',
)
IMITATION_PROMPTS = (
    'a photo of a piece of colorful glass',
    'a photo of a broken colored glass shard',
    'a photo of colored bottle glass',
    'a photo of sea glass',
    'a photo of a decorative glass pebble or glass bead',
    'a photo of a faceted glass imitation gemstone',
    'a photo of a colored plastic or resin imitation gemstone',
    'a photo of melted slag glass',
)
OTHER_PROMPTS = (
    'a photo of a person, face, or selfie',
    'a photo of an outdoor landscape, tree, or plant',
    'a photo of an animal',
    'a photo of a car or building',
    'a photo of food, drink, or furniture',
    'a photo of an ordinary rock or concrete',
    'a photo of a drawing, document, or computer screen',
)
GEM_SCORE_MARGIN = 1.5


def _scores(classifier, image, prompts):
    results = classifier(image, candidate_labels=list(prompts))
    scores = {}
    for result in results:
        label, score = result['label'], float(result['score'])
        if label not in prompts or label in scores:
            raise ValueError('Unexpected screening label')
        if not math.isfinite(score) or not 0 <= score <= 1:
            raise ValueError('Invalid screening score')
        scores[label] = score
    if set(scores) != set(prompts) or sum(scores.values()) <= 0:
        raise ValueError('Incomplete screening results')
    return scores


def screen_specimen(classifier, image):
    """Return passed, uncertain, or unavailable; never bypass failed screening."""
    if classifier is None:
        return 'unavailable'
    try:
        scores = _scores(classifier, image, GEM_PROMPTS + IMITATION_PROMPTS + OTHER_PROMPTS)
        best_gem = max(GEM_PROMPTS, key=scores.get)
        best_negative = max(scores[p] for p in IMITATION_PROMPTS + OTHER_PROMPTS)
        # Require a clear lead: a near-tie is not enough to identify a gem.
        # Compare the strongest individual negative prompt to avoid prompt-count bias.
        # A second call on a subset of these prompts only renormalizes scores;
        # it supplies no independent evidence about the material.
        if scores[best_gem] < best_negative * GEM_SCORE_MARGIN:
            return 'uncertain'
        return 'passed'
    except Exception:
        logging.getLogger(__name__).exception('Specimen screening failed')
        return 'unavailable'
