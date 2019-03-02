using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using ProjVega.Controllers.Resources;
using ProjVega.Core.Models;

namespace ProjVega.Mapping
{
    public class MappingProfile : Profile   
    {
        public MappingProfile()
        {
            CreateMap<Photo, PhotoResource>();
            CreateMap<Make, MakeResource>();
            CreateMap<Make, KeyValuePairResource>();
            CreateMap<Model, KeyValuePairResource>();
            CreateMap<Feature, KeyValuePairResource>();
            CreateMap<Vehicle, SaveVehicleResource>()
                .ForMember(vr => vr.Contact, opt => opt.MapFrom(v => new ContactResource{Name = v.ContactName, Email = v.ContactEmail, Phone = v.ContactPhone}))
                .ForMember(vr => vr.Features, opt=>opt.MapFrom(v => v.Features.Select(vf => vf.FeatureId)));
            CreateMap<Vehicle, VehicleResource>()
                .ForMember(v=>v.Contact, opt=>opt.MapFrom(v => new ContactResource { Name = v.ContactName, Email = v.ContactEmail, Phone = v.ContactPhone }))
                .ForMember(v=>v.Features, opt => opt.MapFrom(v => v.Features.Select(vf => new KeyValuePairResource { Id= vf.Feature.Id, Name = vf.Feature.Name})))
                .ForMember(v=>v.Make, opt=>opt.MapFrom(v => v.Model.Make));

            CreateMap(typeof(QueryResult<>), typeof(QueryResultResource<>));
            CreateMap<VehicleQueryResource, VehicleQuery>();
            CreateMap<SaveVehicleResource, Vehicle>()
                .ForMember(v => v.Id, opt => opt.Ignore())
                .ForMember(v => v.ContactName, opt => opt.MapFrom(vr => vr.Contact.Name))
                .ForMember(v => v.ContactEmail, opt => opt.MapFrom(vr => vr.Contact.Email))
                .ForMember(v => v.ContactPhone, opt => opt.MapFrom(vr => vr.Contact.Phone))
                .ForMember(v => v.Features, opt => opt.Ignore()).AfterMap((vr, v) =>
                {
                    var rem = v.Features.Where(f => (!vr.Features.Contains(f.FeatureId)));
                    foreach (var r in rem) v.Features.Remove(r);
                    var addedFeatures = vr.Features.Where(id => (!v.Features.Any(f => f.FeatureId == id))).Select(id => new VehicleFeature { FeatureId = id });
                    foreach(var f in addedFeatures) v.Features.Add(f);
                });
            //CreateMap<VehicleResource, Vehicle>()
              //  .ForMember(vr => vr.Id, opt => opt.Ignore())
              //  .ForMember(vr => vr.Model, opt => opt.MapFrom(vr => ));
        }
    }
}