FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src
COPY ["src/backend/Tmb.Api/Tmb.Api.csproj", "src/backend/Tmb.Api/"]
COPY ["src/backend/Tmb.Shared/Tmb.Shared.csproj", "src/backend/Tmb.Shared/"]
RUN dotnet restore "src/backend/Tmb.Api/Tmb.Api.csproj"
COPY . .
WORKDIR "/src/src/backend/Tmb.Api"
RUN dotnet build "Tmb.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Tmb.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS final
WORKDIR /app
EXPOSE 8080
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Tmb.Api.dll"]