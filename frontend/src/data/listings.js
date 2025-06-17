export const listings = [
  {
    id: 1,
    type: 'hotel',
    title: 'Oceanview Resort',
    location: 'Hawaii',
    price: 250,
    rating: 4.5,
    images: [
      'https://picsum.photos/seed/hotel1/800/400',
      'https://picsum.photos/seed/hotel12/800/400',
      'https://picsum.photos/seed/hotel13/800/400'
    ],
    reviews: [
      { user: 'Alice', text: 'Wonderful stay!' },
      { user: 'Bob', text: 'Great service and view.' }
    ]
  },
  {
    id: 2,
    type: 'activity',
    title: 'City Bike Tour',
    location: 'Amsterdam',
    price: 50,
    rating: 4.8,
    images: [
      'https://picsum.photos/seed/activity1/800/400',
      'https://picsum.photos/seed/activity2/800/400'
    ],
    reviews: [
      { user: 'Cara', text: 'Loved exploring by bike!' }
    ]
  }
];
