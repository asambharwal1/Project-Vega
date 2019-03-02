using ProjVega.Core;
using System.Threading.Tasks;

namespace ProjVega.Persistence
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly VegaDbContext _context;

        public UnitOfWork(VegaDbContext context)
        {
            _context = context;
        }

        public async Task Complete()
        {
            await _context.SaveChangesAsync();
        }
    }
}