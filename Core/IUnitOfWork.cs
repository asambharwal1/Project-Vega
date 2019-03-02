using System.Threading.Tasks;

namespace ProjVega.Core
{
    public interface IUnitOfWork
    {
        Task Complete();
    }
}