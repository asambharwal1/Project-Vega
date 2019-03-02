using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using ProjVega.Core.Models;

namespace ProjVega.Core
{
    public interface IVehicleRepository
    {
        Task<Vehicle> GetVehicle(int id, bool includeRelated = true);
        void Add(Vehicle vehicle);
        void Remove(Vehicle vehicle);
        Task<QueryResult<Vehicle>> GetVehicles(VehicleQuery filter);
    }
}