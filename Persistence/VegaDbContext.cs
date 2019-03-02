using Microsoft.EntityFrameworkCore;
using ProjVega.Core.Models;

namespace ProjVega.Persistence
{
    public class VegaDbContext : DbContext
    {

        public DbSet<Make> Makes { get; set; }
        public DbSet<Feature> Features { get; set; }
        public DbSet<Model> Models { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Photo> Photos { get; set; }    

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<VehicleFeature>().HasKey(vf => new {vf.VehicleId, vf.FeatureId});
        }

        public VegaDbContext(DbContextOptions<VegaDbContext> options) :
            base(options)
        {
        }

        
    }
}