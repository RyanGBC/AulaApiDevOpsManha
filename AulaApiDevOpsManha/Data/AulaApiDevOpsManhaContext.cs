using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AulaApiDevOpsManha.Models;

namespace AulaApiDevOpsManha.Data
{
    public class AulaApiDevOpsManhaContext : DbContext
    {
        public AulaApiDevOpsManhaContext (DbContextOptions<AulaApiDevOpsManhaContext> options)
            : base(options)
        {
        }

        public DbSet<AulaApiDevOpsManha.Models.Produtos> Produtos { get; set; } = default!;
        public DbSet<AulaApiDevOpsManha.Models.Fornecedor> Fornecedor { get; set; } = default!;
    }
}
