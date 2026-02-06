FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src
COPY ["src/backend/Tmb.Worker/Tmb.Worker.csproj", "src/backend/Tmb.Worker/"]
COPY ["src/backend/Tmb.Shared/Tmb.Shared.csproj", "src/backend/Tmb.Shared/"]
RUN dotnet restore "src/backend/Tmb.Worker/Tmb.Worker.csproj"
COPY . .
WORKDIR "/src/src/backend/Tmb.Worker"
RUN dotnet build "Tmb.Worker.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Tmb.Worker.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Tmb.Worker.dll"]