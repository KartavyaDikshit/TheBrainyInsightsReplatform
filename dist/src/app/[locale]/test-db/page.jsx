import { prisma } from '@tbi/database';
export default async function TestDBPage() {
    const [categories, reports, users] = await Promise.all([
        prisma.category.count(),
        prisma.report.count(),
        prisma.user.count()
    ]);
    const featuredCategories = await prisma.category.findMany({
        where: { featured: true },
        include: {
            _count: {
                select: { reports: true }
            }
        },
        orderBy: { sortOrder: 'asc' }
    });
    return (<div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Database Test</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="font-bold">Categories</h3>
          <p className="text-2xl">{categories}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="font-bold">Reports</h3>
          <p className="text-2xl">{reports}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded">
          <h3 className="font-bold">Users</h3>
          <p className="text-2xl">{users}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Featured Categories</h2>
      <div className="grid grid-cols-2 gap-4">
        {featuredCategories.map(category => (<div key={category.id} className="border p-4 rounded">
            <h3 className="font-bold">{category.icon} {category.title}</h3>
            <p className="text-sm text-gray-600">{category.description}</p>
            <p className="text-sm mt-2">Reports: {category._count.reports}</p>
          </div>))}
      </div>
    </div>);
}
