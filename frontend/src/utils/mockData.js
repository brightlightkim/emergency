/**
 * Mock data for development and testing
 */

export const mockTranscription = "Help! My friend fell while hiking and I think he broke his ankle. He's in a lot of pain and can't walk. We're on the trail about 2 miles from the trailhead. There's swelling and some bruising.";

export const mockImageAnalysis = {
  "all_detections": [
    {
      "class": "person",
      "confidence": 0.92
    },
    {
      "class": "backpack",
      "confidence": 0.78
    },
    {
      "class": "bottle",
      "confidence": 0.65
    }
  ],
  "emergency_detections": [
    {
      "class": "person",
      "confidence": 0.92
    }
  ],
  "has_emergency": true
};

export const mockFirstAidResponse = `
FIRST AID INSTRUCTIONS FOR ANKLE INJURY:

1. Keep the person still and calm. Have them sit or lie down.

2. Apply the RICE method:
   - Rest: Do not allow the person to put weight on the injured ankle.
   - Ice: Apply an ice pack wrapped in a cloth for 15-20 minutes every 2-3 hours.
   - Compression: Use an elastic bandage to compress the area, but not too tightly.
   - Elevation: Keep the ankle elevated above heart level if possible.

3. Check circulation: Make sure the bandage is not too tight by checking if the person can still wiggle their toes.

4. Pain management: Over-the-counter pain relievers like ibuprofen can help reduce pain and swelling.

5. Do not attempt to realign the ankle if it appears deformed.

6. Call for emergency assistance or arrange transportation to a medical facility, as an X-ray will likely be needed to determine the severity of the injury.

WARNING: Do not allow the person to put weight on the injured ankle until cleared by a medical professional. If there is severe deformity, numbness, or discoloration, treat it as an emergency requiring immediate medical attention.
`;

export const mockLocation = {
  latitude: 37.7749,
  longitude: -122.4194
};

/**
 * Helper function to simulate API delays
 */
export const simulateApiDelay = (data, delay = 1500) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay);
  });
};
