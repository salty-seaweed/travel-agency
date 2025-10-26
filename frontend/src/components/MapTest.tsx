import { InteractiveMap } from './InteractiveMap';

// Sample data for testing the map
const sampleProperties = [
  {
    id: 1,
    name: "Paradise Beach Resort",
    description: "Luxury beachfront resort with stunning ocean views",
    price_per_night: 250,
    location: {
      latitude: 3.2028,
      longitude: 73.2207,
      island: "Male",
      atoll: "North Male Atoll"
    },
    property_type: {
      name: "Resort"
    },
    amenities: [
      { name: "WiFi" },
      { name: "Pool" },
      { name: "Restaurant" }
    ],
    images: [
      { image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop" }
    ],
    rating: 4.5,
    review_count: 128,
    is_featured: true
  },
  {
    id: 2,
    name: "Coral Guesthouse",
    description: "Cozy guesthouse perfect for budget travelers",
    price_per_night: 80,
    location: {
      latitude: 3.2128,
      longitude: 73.2307,
      island: "Hulhumale",
      atoll: "North Male Atoll"
    },
    property_type: {
      name: "Guesthouse"
    },
    amenities: [
      { name: "WiFi" },
      { name: "Kitchen" }
    ],
    images: [
      { image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop" }
    ],
    rating: 4.2,
    review_count: 89,
    is_featured: false
  },
  {
    id: 3,
    name: "Ocean View Villa",
    description: "Private villa with direct beach access",
    price_per_night: 350,
    location: {
      latitude: 3.1928,
      longitude: 73.2107,
      island: "Villingili",
      atoll: "South Male Atoll"
    },
    property_type: {
      name: "Villa"
    },
    amenities: [
      { name: "WiFi" },
      { name: "Pool" },
      { name: "Private Beach" },
      { name: "Spa" }
    ],
    images: [
      { image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop" }
    ],
    rating: 4.8,
    review_count: 156,
    is_featured: true
  }
];

export function MapTest() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Interactive Map Test</h1>
        <p className="text-gray-600 mb-8">
          This is a test page to verify the interactive map functionality works correctly.
          You should see three sample properties marked on the map.
        </p>
        
        <InteractiveMap
          properties={sampleProperties}
          height="600px"
          showFilters={true}
          onPropertyClick={(property) => {
            console.log('Property clicked:', property);
            alert(`Clicked on: ${property.name}`);
          }}
        />
      </div>
    </div>
  );
} 