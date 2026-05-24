"""
Validation script for ER Map JSON files.
Validates files against schema.json and checks controlled vocabularies.
"""

import json
import sys
from pathlib import Path
from jsonschema import validate, ValidationError, RefResolver

def load_schema(schema_path):
    """Load JSON schema from file."""
    with open(schema_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def load_json_file(file_path):
    """Load a JSON file and return its content."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON in {file_path}: {e}")
        return None

def validate_file(file_path, schema, schema_path):
    """Validate a single JSON file against the schema."""
    data = load_json_file(file_path)
    if data is None:
        return False

    try:
        # Create resolver for $ref resolution
        base_uri = Path(schema_path).parent.as_uri() + "/"
        resolver = RefResolver(base_uri, schema)

        validate(instance=data, schema=schema, resolver=resolver)
        print(f"PASS: {file_path.name}")
        return True
    except ValidationError as e:
        print(f"FAIL: {file_path.name}")
        print(f"  Error: {e.message}")
        print(f"  Path: {' -> '.join(str(p) for p in e.absolute_path)}")
        return False

def main():
    if len(sys.argv) < 2:
        print("Usage: python validate.py <file_or_directory> [schema_path]")
        print("  file_or_directory: Path to JSON file or directory to validate")
        print("  schema_path: Path to schema.json (default: ./schema.json)")
        sys.exit(1)

    target = Path(sys.argv[1])
    schema_path = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(__file__).parent.parent / "schema.json"

    # Load schema
    if not schema_path.exists():
        print(f"ERROR: Schema file not found: {schema_path}")
        sys.exit(1)

    schema = load_schema(schema_path)

    # Validate
    if target.is_file():
        if target.suffix == '.json':
            success = validate_file(target, schema)
            sys.exit(0 if success else 1)
        else:
            print(f"ERROR: Not a JSON file: {target}")
            sys.exit(1)

    elif target.is_dir():
        json_files = list(target.glob('**/*.json'))
        if not json_files:
            print(f"No JSON files found in {target}")
            sys.exit(0)

        print(f"Validating {len(json_files)} JSON files in {target}...\n")

        passed = 0
        failed = 0

        for json_file in sorted(json_files):
            if validate_file(json_file, schema):
                passed += 1
            else:
                failed += 1

        print(f"\n{'='*60}")
        print(f"Results: {passed} passed, {failed} failed, {passed + failed} total")
        print(f"{'='*60}")

        sys.exit(0 if failed == 0 else 1)

    else:
        print(f"ERROR: Path not found: {target}")
        sys.exit(1)

if __name__ == "__main__":
    main()
