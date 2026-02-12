import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const menuItems = [
  {
    category: 'Ice Cream',
    items: [
      { name: 'Vanilla Bean', description: 'Classic Madagascar vanilla', price: '$4.50' },
      { name: 'Chocolate Fudge', description: 'Rich dark chocolate with fudge swirls', price: '$4.50' },
      { name: 'Strawberry', description: 'Fresh strawberry ice cream', price: '$4.50' },
      { name: 'Mint Chocolate Chip', description: 'Cool mint with chocolate chips', price: '$4.50' },
      { name: 'Cookies & Cream', description: 'Oreo cookies mixed in vanilla', price: '$5.00' },
    ],
  },
  {
    category: 'Cobblers',
    items: [
      { name: 'Peach Cobbler', description: 'Warm peaches with buttery crust', price: '$6.50' },
      { name: 'Apple Cobbler', description: 'Cinnamon apples with brown sugar topping', price: '$6.50' },
      { name: 'Berry Cobbler', description: 'Mixed berries with vanilla ice cream', price: '$7.00' },
    ],
  },
  {
    category: 'Sundaes',
    items: [
      { name: 'Hot Fudge Sundae', description: 'Vanilla ice cream, hot fudge, whipped cream', price: '$6.00' },
      { name: 'Caramel Delight', description: 'Caramel sauce, nuts, cherry on top', price: '$6.00' },
      { name: 'Banana Split', description: 'Three scoops, banana, toppings', price: '$8.00' },
    ],
  },
];

export default function MenuPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-12 text-primary">Our Menu</h1>
          
          <div className="space-y-12">
            {menuItems.map((section) => (
              <div key={section.category}>
                <h2 className="text-3xl font-semibold mb-6 text-accent">{section.category}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {section.items.map((item) => (
                    <div key={item.name} className="bg-white p-6 rounded-lg shadow-md">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                        <span className="text-primary font-bold">{item.price}</span>
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
