using System.Collections.Generic;
using System.Threading.Tasks;
using ProjVega.Core.Models;

namespace ProjVega.Core
{
    public interface IPhotoRepository
    {
        Task<IEnumerable<Photo>> GetPhotos(int vehicleId);
    }
}