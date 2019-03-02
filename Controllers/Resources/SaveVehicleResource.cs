using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace ProjVega.Controllers.Resources
{
    public class SaveVehicleResource
    {
        public int Id { get; set; }

        public int ModelId { get; set; }

        public bool isRegistered { get; set; }

        public ContactResource Contact { get; set; }

        public ICollection<int> Features { get; set; }

        public SaveVehicleResource()
        {
            Features = new Collection<int>();
        }
    }
}