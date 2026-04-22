using MyBackendApp.Database;
using MyBackendApp.Controller;
using MyBackendApp.Encode;
using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddScoped<EncryptHelper>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Your React URL
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
// database connection
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

var app = builder.Build();


// app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.MapControllers();
app.MapGet("/",()=>"C# server is running");



app.Run();

