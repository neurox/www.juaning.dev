---
title: "Architectural Shifts: Replacing Installation Profiles with Drupal 11 Recipes"
seoTitle: "Drupal 11 Recipes vs Installation Profiles: Enterprise Multisite Architecture | Juan Gómez"
description: "How Drupal 11 Recipes are replacing monolithic installation profiles for composable, standardized feature rollout across enterprise multisite ecosystems."
date: "2026-05-18"
categories: ["Drupal", "Architecture"]
tags: ["Drupal 11", "Recipes", "Installation Profiles", "Multisite", "Composer"]
icon: "terminal"
---

For years, enterprise Drupal shops have faced an uncomfortable trade-off. **Installation Profiles** -- those monolithic `*.profile` files bundled with custom modules, hard-coded configuration, and installer logic -- were the only reliable way to standardize a platform across dozens of sites. They worked, but they ossified. Every division-specific tweak meant a fork. Every fork meant a maintenance burden that grew quadratically with the number of tenants.

Drupal 11 changes this equation. With **Recipes** stabilized in core as of the 11.x release cycle, we now have a composable alternative that fundamentally shifts how we provision and scale enterprise platforms. This post explores the architectural implications for large-scale multisite ecosystems running dozens of divisions.

## The Problem with Monolithic Installation Profiles

Consider a typical enterprise scenario: a holding company with 15 operating divisions, each requiring a Drupal site with shared baseline functionality (SSO, content governance, media management) plus division-specific feature sets (custom workflows, domain-specific content models, integrated line-of-business systems).

With Installation Profiles, the architecture typically collapses into one of two equally painful patterns:

**Pattern A: The Kitchen-Sink Distribution**
A single profile containing every possible feature, gated by permissions and configuration. Simple to deploy -- one profile to rule them all -- but every site pays the performance and complexity tax for features it does not use. Updates require coordinated regression testing across all divisions.

**Pattern B: Forked Distributions**
Each division maintains its own profile inheriting from a base. Flexible, but the inheritance chain quickly becomes a dependency nightmare. A security update to the base profile must be propagated to 15 forks, each with its own conflicts and overrides. Drush PM and Composer struggle to resolve these nested dependency graphs.

Both patterns share a root cause: **Installation Profiles are all-or-nothing artifacts.** They bundle modules, configuration, and installation logic into a single atomic unit that cannot be easily composed, reordered, or selectively applied after initial site installation.

## Drupal 11 Recipes: A Composable Alternative

Recipes solve this by decoupling the concerns that Installation Profiles forced together. A Recipe is a reusable, declarative package that can:

- Install modules and themes
- Import configuration
- Execute arbitrary PHP during application
- Declare dependencies on other Recipes
- Be applied to an existing site -- not just during installation

This last point is transformative for enterprise workflows. You are no longer locked into decisions made at `drush site:install` time. A Recipe can be applied incrementally as business requirements evolve, enabling a genuinely iterative approach to platform standardization.

Let us look at a concrete example for our holding company scenario.

### Base Infrastructure Recipe

```yaml
# recipes/base-infrastructure/recipe.yml
name: "Base Infrastructure"
description: "Core SSO, audit logging, and media management for all divisions"
type: Recipe

install:
  - acquia_connector
  - samlauth
  - automated_cron
  - media
  - media_library

config:
  actions:
    system.site:
      simpleConfig:
        page.front: "/node/1"
    samlauth.settings:
      simpleConfig:
        sp_entity_id: "https://sso.internal.example.com"
        idp_url: "https://idp.example.com/saml2"
```

### Division-Specific Workflow Recipe

```yaml
# recipes/division-hr-workflows/recipe.yml
name: "HR Division Workflows"
description: "Custom content workflows and integration for HR division"
type: Recipe

dependencies:
  - recipes/base-infrastructure

install:
  - workflows
  - content_moderation
  - views_bulk_operations

config:
  actions:
    workflows.workflow.editorial:
      create:
        id: editorial
        label: "HR Editorial"
        type: content_moderation
        type_settings:
          states:
            draft:
              label: Draft
            review:
              label: In Review
            published:
              label: Published
          transitions:
            submit_for_review:
              from: [draft]
              to: review
            approve:
              from: [review]
              to: published
```

Each Recipe declares its dependencies explicitly. When applied, Drupal resolves the dependency graph and applies Recipes in topological order, ensuring base infrastructure is in place before division-specific workflows are layered on top.

## Provisioning at Scale: A Multisite Workflow

For an enterprise platform, the provisioning workflow shifts from "clone an installation profile and customize" to "apply a curated set of Recipes." Here is how this plays out in practice:

```bash
# Step 1: Install a minimal Drupal 11 instance
composer create-project drupal/recommended-project divisions-platform
cd divisions-platform

# Step 2: Add your Recipe repository
composer config repositories.recipes vcs https://github.com/example/recipes.git
composer require example/recipes:^1.0

# Step 3: Provision each division site
# Division A -- standard setup
drush site:install minimal --yes
drush recipe recipes/base-infrastructure
drush recipe recipes/division-content-publishing

# Division B -- HR, with additional workflow recipes
drush site:install minimal --yes
drush recipe recipes/base-infrastructure
drush recipe recipes/division-hr-workflows
drush recipe recipes/division-hiring-portal

# Division C -- minimal footprint (public-facing microsite)
drush site:install minimal --yes
drush recipe recipes/base-infrastructure
drush recipe recipes/public-microsite
```

Notice what is absent: there is no monolithic distribution fork, no fragile inheritance chain, and no up-front commitment to every feature a division might eventually need. Each division starts from the same minimal base and layers on exactly the Recipes it requires.

## CI/CD Integration

In a GitOps workflow, Recipes integrate naturally with your deployment pipeline. Consider a GitHub Actions matrix build that validates every Recipe combination in use across your ecosystem:

```yaml
jobs:
  recipe-validation:
    strategy:
      matrix:
        recipe-set:
          - "base-infrastructure division-content-publishing"
          - "base-infrastructure division-hr-workflows division-hiring-portal"
          - "base-infrastructure public-microsite"
    steps:
      - uses: actions/checkout@v4
      - name: Validate recipe composition
        run: |
          ddev drush site:install minimal --yes
          for recipe in ${{ matrix.recipe-set }}; do
            ddev drush recipe recipes/$recipe
          done
          ddev drush core:status
```

Each cell in the matrix validates that the Recipe composition installs cleanly, configuration imports without errors, and no dependency conflicts surface. Failed compositions block the pipeline before they ever reach production.

## Operational Advantages

The shift from Installation Profiles to Recipes yields measurable operational benefits for enterprise teams:

**Independent Lifecycles.** Base infrastructure modules can be updated independently of division-specific features. A patch to the SAML authentication module does not require revalidating HR workflows or the hiring portal.

**Gradual Adoption.** Recipes can be applied to existing production sites. You can migrate a legacy installation profile site piece by piece, extracting functionality into Recipes incrementally, rather than planning a risky big-bang cutover.

**Testing Surface Reduction.** Each Recipe can be tested in isolation and in known compositions. The testing matrix is combinatorial across your active compositions rather than exponential across all possible feature interactions.

**Role Specialization.** A platform team owns the base infrastructure Recipe. Division teams own their domain-specific Recipes. The dependency graph provides a clear contract between teams, eliminating the coordination overhead of a shared monolithic profile.

## Migration Strategy for Existing Installation Profiles

If you are managing a legacy Drupal 7 or 10 platform with a custom installation profile today, the migration path to Recipes is deliberate but achievable:

1. **Audit your profile.** Decompose it into logical feature boundaries. Each boundary becomes a candidate Recipe.
2. **Identify shared infrastructure.** SSO, media, analytics, and governance should become your base Recipe.
3. **Extract incrementally.** Build each Recipe against a fresh `minimal` Drupal 11 install. Validate that it works in isolation.
4. **Compose in staging.** Apply Recipes in groups matching your current multisite configuration. Compare the resulting configuration against your legacy sites.
5. **Roll out gradually.** Apply the base Recipe first across all sites, then layer division-specific Recipes. The ability to apply Recipes to running sites means you can iterate without maintenance windows.

## When Installation Profiles Still Make Sense

To be precise: Recipes do not obsolete Installation Profiles entirely. If you are distributing a standalone product -- say, a Drupal distribution for universities or non-profits -- a well-crafted installation profile still provides a single-package experience that is simpler for end users. Recipes excel in environments where you control the deployment pipeline and need composability over packaging simplicity.

## The Architectural Takeaway

The stabilization of Drupal Recipes in 2026 is not merely a new feature -- it is an architectural shift in how we think about platform provisioning. Installation Profiles optimized for the **packaging** problem: how to ship a complete Drupal experience in one artifact. Recipes optimize for the **composition** problem: how to assemble standardized, testable, independently maintained feature sets across a heterogeneous ecosystem.

For enterprise teams managing multisite platforms at scale, the choice is clear. Recipes reduce the coordination tax, eliminate the fork-maintenance cycle, and bring the same composability principles that transformed microservices architecture to the world of Drupal site provisioning.
